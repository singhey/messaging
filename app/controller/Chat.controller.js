import Chat from "../models/ChatModel"
import Claim from "../models/MemoryClaim"
import User from "../models/User.model"
import Message from '../models/Message.model'
import parametersPresent from "./parametersPresent"

const ChatController = {
    initChat: async (req) => {
        parametersPresent(req.body, ["messageId"])
        const [claim, message] = await Promise.all([Claim.findOne({createdBy: req.user.id, messageId: req.body.messageId}).lean(), Message.findById(req.body.messageId).lean()])
        if(!claim) {
            throw new Error("Not allowed")
        }
        if(!claim.approved) {
            throw new Error("How did you get so far")
        }
        const user = await User.findById(req.user.id)
        //check a chat exists

        // console.log(user.chats?.filter(c => {
        //     console.log(c.withUser.toString(), message.createdBy, c.withUser.toString() === message.createdBy.toString())
        //     return c.withUser.toString() === message.createdBy.toString()
        // }))

        const chatExists = user.chats?.filter(c => c.withUser.toString() === message.createdBy.toString())
        if(chatExists && chatExists[0]) {
            // console.log("Returnng existing")
            return await Chat.findById(chatExists[0].chat)
        }else{
            // const _ = await Promise.all([Chat.findOne({user1: req.user.id, user2: req.body.toUser}).lean(), Chat.findOne({user2: req.user.id, user1: req.body.toUser}).lean()])
            // console.log("Creating new", user.chats, user._id, user.name)
            const chat = new Chat({
                user1: req.user.id,
                user2: message.createdBy
            })
            user.chats.push({
                chat: chat._id,
                withUser: message.createdBy
            })
            const toUser = await User.findById(message.createdBy)
            toUser.chats.push({
                chat: chat._id,
                withUser: message.createdBy
            })
            await Promise.all([toUser.save(), chat.save(), user.save()])
            return chat
            // }
        }
    },

    sendMessage: async(req) => {
        parametersPresent(req.body, ["message", "toUser", "chatId"])
        if(req.body.message.length > 250) {
            throw new Error("Message can be max 250 chars")
        }
        const chat = await Chat.findById(req.body.chatId).select('_id user1 user2 messages')
        // const chat = _[0]

        if(!chat) {
            throw new Error("Chat not found")
        }

        if(chat.user1.toString() !== req.body.toUser && chat.user2.toString() !== req.body.toUser) {
            throw new Error("Not allowed!")
        }
        
        if(chat.messages.length > 50) {
            chat.messages = chat.messages.slice(chat.messages.length - 50)
        }
        chat.messages.push({
            text: req.body.message,
            sender: req.user.id
        })
        chat.lastMessage = req.body.message        
        await chat.save()

        return {done: true}
    },

    fetchChat: async (req) => {
        const chats = await Promise.all([Chat.find({user1: req.user.id}).populate('user2', 'username name dp _id').select('user2 updatedAt lastMessage').lean().limit(10).sort({_id: -1}), 
            Chat.find({user2: req.user.id}).select('user1 updatedAt lastMessage').populate('user1', 'username name dp _id').lean().limit(10).sort({_id: -1})])
        let a = []
        chats[0].forEach(c => {
            if(!c.user2) {
                throw new Error("User not found with id")
            }
            a.push({
                id: c._id,
                user: c.user2,
                updatedAt: c.updatedAt,
                lastMessage: c.lastMessage
            })
        })
        chats[1].forEach(c => {
            if(!c.user1) {
                throw new Error("User not found with id")
            }
            a.push({
                id: c._id,
                user: c.user1,
                updatedAt: c.updatedAt,
                lastMessage: c.lastMessage
            })
        })
        // console.log(a, chats)
        //join these two arrays
        return a
    },

    fetchSpecificChat: async (req) => {
        const chat = await Chat.findById(req.params.chatId).lean()
        if(!chat) {
            throw new Error("Chat not found")
        }
        // console.log(req.user.id, chat.user1, chat.user2)
        if(chat.user1.toString() !== req.user.id && chat.user2.toString() !== req.user.id) {
            throw new Error("Not Allowed!")
        }
        return chat
    }

}

module.exports = ChatController