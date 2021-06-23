import mongoose from 'mongoose'
const mongoosePaginate = require('mongoose-paginate-v2');

let ChatSchema = new mongoose.Schema({
    messages: [
        {
            sender: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    lastMessage: {
        type: String,
        default: ""
    },
    allRead: {
        type: Boolean,
        default: true
    },
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "User"
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "User"
    }
}, {timestamps: {}})

ChatSchema.plugin(mongoosePaginate)
let Chat = mongoose.model('Chat', ChatSchema)

export default Chat;