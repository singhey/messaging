import mongoose from 'mongoose'
import { Schema } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

let ClaimSchema = new mongoose.Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    messageId: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        index: true
    },
    approved: {
        type: Boolean,
        default: false,
        index: true
    },
    claimedAt: {
        type: Date
    },
    claimed: {
        type: Boolean,
        default: false
    },
    rejectedTimes: {
        type: Number,
        default: 0
    },
    approvedAt: {
        type: Date
    }
}, {strict: true, timestamps: {}})

ClaimSchema.plugin(mongoosePaginate)
let Claim = mongoose.model('Claim', ClaimSchema)

export default Claim;