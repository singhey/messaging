import mongoose from 'mongoose'
import { Schema } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

let MessageSchema = new mongoose.Schema({
  createdBy:{
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true
  },
  message:{
    type: "String",
  },
  imagePath: {
    type: String,
    default: "/logo.png"
  },
  thumbnailPath: {
    type: String,
    default: "/logo.png"
  },
}, {strict: true, timestamps: {}})

MessageSchema.plugin(mongoosePaginate)
let Message = mongoose.model('Message', MessageSchema)

export default Message;