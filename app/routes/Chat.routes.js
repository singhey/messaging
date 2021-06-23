const express = require('express')
import authVerifier from './helpers/authVerifier'
import formResponse from './helpers/formResponse'
const router = express.Router()
const ChatController = require('../controller/Chat.controller')


router.post('/init', authVerifier, async (req, res, next) => {
        try {
            const data = await ChatController.initChat(req)
            return formResponse(res, data, 200)
        }catch(err) {
            next(err)
        }
    })
    .post('/send', authVerifier, async (req, res, next) => {
        try {
            const data = await ChatController.sendMessage(req)
            return formResponse(res, data, 201)
        }catch(err) {
            next(err)
        }
    })
    .get('/', authVerifier, async (req, res, next) => {
        try {
            const data = await ChatController.fetchChat(req)
            return formResponse(res, data, 200)
        }catch(err) {
            next(err)
        }
    })
    .post('/messages/:chatId', authVerifier, async (req, res, next) => {
        try {
            const data = await ChatController.fetchSpecificChat(req)
            return formResponse(res, data, 200)
        }catch(err) {
            next(err)
        }
    })

export default router