import mongoose from 'mongoose'

let ConversationLegendSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    conversations: [
        {
            user: {
                user: {
                    type: String
                },
                username: {
                    type: String
                },
                dp: {
                    type: String
                }
            },
            conversationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Conversation",
                required: true
            }
        }
    ]
})

let ConversationLegend = mongoose.model('ConversationLegend', ConversationLegendSchema)

export default ConversationLegend;