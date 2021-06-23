import Conversation from '../models/Conversation.model'
import ConversationLegendModel from '../models/ConversationsLegend.model'
import Claim from '../models/MemoryClaim'
import User from '../models/User.model'
import Chat from '../models/ChatModel'
import parametersPresent from './parametersPresent'

const ConversationLegend = {
    initConversation: async (req) =>{
        
        parametersPresent(req.body, ["claimId", "toUsername", "message"])

        const _ = await Promise.all([Claim.findById(req.body.claimId).lean(), User.findOne({username: req.body.toUsername}).lean(), User.findById(req.user.id)])
        if(!_[0]) {
            throw new Error({message: "Claim Id is not present to approve chat", status: 404})
        }else if(!_[1]) {
            throw new Error({message: "User does not exist to approve claim", status: 404})
        }

        const claimId = _[0]
        const forUser = _[1]
        const curUser = _[2]
        if(!claimId.approved) {
            throw new Error({message: "Ummm... How did you reach so far?", status: 403})
        }

        //check if the conversation exists in legend
        const conversation = new Conversation({
            lastMessage: req.body.message,
            messages: [
                {sender: req.user.id, text: req.body.message}
            ]
        })
        let fromCon = {
            user: forUser._id,
            conversationId: conversation._id
        }

        let toCon = {
            user: req.user.id,
            conversationId: conversation._id
        }

        const _c = await Promise.all([ConversationLegendModel.findOne({user: req.user.id}), ConversationLegendModel.findOne({user: forUser._id})])
        let fromUserConversationLegend = _c[0]
        let toUserConversationLegend = _c[1]
        if(!fromUserConversationLegend) {
            fromUserConversationLegend = new ConversationLegendModel({
                user: req.user.id,
                conversations: [
                    fromCon
                ]
            })
        }else {
            for(let i = 0; i < fromUserConversationLegend.conversations.length; i++) {
                if(fromUserConversationLegend.conversations[i].user.toString() === forUser._id.toString()) {
                    const conversation = await Conversation.findById(fromUserConversationLegend.conversations[i].conversationId)
                    return conversation
                }
            }
            fromUserConversationLegend.conversations.push(fromCon)

        }

        if(!toUserConversationLegend) {
            toUserConversationLegend = new ConversationLegendModel({
                user: forUser._id,
                conversations: [
                    toCon
                ]
            })
        }else {
            toUserConversationLegend.conversations.push(toCon)
        }

        const saved = await Promise.all([fromUserConversationLegend.save(), conversation.save(), toUserConversationLegend.save()])
        return {conversation}
    },

    getConversations: async(req) => {
        const conversations = await ConversationLegendModel.findOne({user: req.user.id}).populate('conversations.conversationId', '_id lastMessage updatedAt').lean()
        return conversations
    }
}

module.exports = ConversationLegend