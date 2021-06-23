import mongoose from 'mongoose'
const mongoosePaginate = require('mongoose-paginate-v2');

let ConversationSchema = new mongoose.Schema({
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId
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
    }
}, {timestamps: {}})

ConversationSchema.plugin(mongoosePaginate)
let Conversation = mongoose.model('Conversation', ConversationSchema)

export default Conversation;