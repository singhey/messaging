import mongoose, { Schema } from 'mongoose'
const mongoosePaginate = require('mongoose-paginate-v2');

let UserSchema = new mongoose.Schema({
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
  },
  countryCode: {
    type: "String",
  },
  dialCode: {
    type: "String",
  },
  country: {
    type: "String",
  },
  name: {
    type: String
  },
  role: {
    type: Number,
    default: 2
  },
  pushData: [{
    type: String
  }],
  bio: {
    type: String
  },
  dp: {
    type: String
  },
  totalRequests: {
    type: Number,
    default: 0,
    index: true
  },
  gender: {
    type: String,
    required: true
  },
  dob: {
    type: Date
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  chats: [
    {chat: {type: Schema.Types.ObjectId, ref: "Chat"}, withUser: {type: Schema.Types.ObjectId, ref: "User"}}
  ],
  acceptedMessages: [
    {message: {type: Schema.Types.ObjectId, ref: "Message"}, acceptedAt: Date}
  ]
}, {strict: true, timestamps: {}})

UserSchema.plugin(mongoosePaginate)
let User = mongoose.model('User', UserSchema)


export default User;