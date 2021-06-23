import express from 'express'
import TextMessage from '../models/TextMessages.model'
import User from '../models/User.model'
import checkRole from './helpers/checkRole'
import formResponse from './helpers/formResponse'
import push from 'web-push'
import {webPush} from '../config/CONSTANTS'
import authVerifier from './helpers/authVerifier'

const router = express.Router()

const sendNotification = (pushData, dataToSend, id, tries = 1) => {
    if(tries > 2) {
      return
    }
    try {
      if(!pushData) {
        throw new Error("Push data not present to send notification")
      }
      push.setVapidDetails('mailto:singhey3@gmail.com', webPush.publicKey, webPush.privateKey)
      push.sendNotification(JSON.parse(pushData), JSON.stringify(dataToSend))
        .then(res => {
          
            // logger.info(res.message)
        }).catch(err => {
            // logger.error(`Unable to send notification to user with id ${id} and push data ${pushData} with error ${err.message}`)
            //If notification failes due to timeout then try to send notification once more
            // if(err.message.indexOf("ETIMEDOUT") !== -1) {
            //   sendNotification(pushData, dataToSend, id, tries + 1)
            // }
        })
        
    }catch(err) {
    //   logger.error(`Unable to send notification to user with id ${id} and push data ${pushData} with error ${err.message}`)
    }
}

const hexadecimalSharting = string => {
    const values = {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "a": 10,
        "b": 11,
        "c": 12,
        "d": 13,
        "e": 14,
        "f": 15
    }
    let sum = 0
    for(let i = 0; i < string.length; i++) {
        sum += values[string[i]]
    }
    return sum % 2
}


router.post('/send', authVerifier, async (req, res, next) => {
    try {
        const _ = await Promise.all([User.findById(req.body.sendTo), User.findById(req.user.id)])
        const fromUser = _[1]
        const user = _[0]
        if(!user) {
            throw new Error("Opposite end user doesn't exist to send a message")
        }

        //check if a conversation already exists
        // if()


        const textMessage = new TextMessage({
            createdBy: req.user.id,
            sentTo: req.body.sendTo,
            textMessage: req.body.textMessage
        })

        await textMessage.save()
        user.pushData.forEach(pushData => sendNotification(pushData, {
            title: fromUser.name,
            body: `${req.body.textMessage}`,
            url: "/messages"
        }), user._id)

        return formResponse(res, {message: "Delivered"}, 200)
        // res.send({message: "Delivered"})
    }catch(err) {
        next({message: err.message, status: 403})
    }
})

router.post('/get', authVerifier, async (req, res, next) => {
    try {
        const messages = await Promise.all([TextMessage.find({createdBy: req.user.id, sentTo: req.body.sentTo}), TextMessage.find({sentTo: req.user.id, createdBy: req.body.sentTo})]) 
        return formResponse(req, {
            sent: messages[0],
            received: messages[1]
        }, 200)
    }catch(err) {
        next(err)
    }
})

router.post('/get-users', authVerifier, async(req, res, next) => {
    try {

        // const messages = await TextMessage.find({})
        const messages = await Promise.all([TextMessage.find({createdBy: req.user.id, sentTo: req.body.sentTo}), TextMessage.find({sentTo: req.user.id, createdBy: req.body.sentTo})]) 
        
        return formResponse(req, {
            sent: messages[0],
            received: messages[1]
        }, 200)
    }catch(err) {
        next(err)
    }
})

export default router