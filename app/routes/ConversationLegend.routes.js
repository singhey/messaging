import authVerifier from './helpers/authVerifier'
import ConversationLegend from '../controller/ConversationLegend.controller'
import formResponse from './helpers/formResponse'

const express = require('express')

const router = express.Router()

router.post('/initConversation', authVerifier, async(req, res, next) => {
    try {
        // ConversationLegend.
        const data = await ConversationLegend.initConversation(req)
        formResponse(res, data, 201)
    }catch(err) {
        next(err)
    }
})


router.post('/', authVerifier, async (req, res, next) => {
    try {
        
    }catch(err) {
        next(err)
    }
})

router.get('/', authVerifier, async(req, res, next) => {
    try {
        const data = await ConversationLegend.getConversations(req)
        // console.log(data)
        formResponse(res, data, 200)
    }catch(err) {
        next(err)
    }
})

export default router