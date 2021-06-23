import mongoose from 'mongoose'
import { Schema } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

let TextMessageSchema = new mongoose.Schema({
  textMessage:{
    type: "String",
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  sentTo: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  messageSeen: {
    type: Boolean,
    default: false
  }
})

TextMessageSchema.plugin(mongoosePaginate)
let TextMessage = mongoose.model('TextMessage', TextMessageSchema)

export default TextMessage;