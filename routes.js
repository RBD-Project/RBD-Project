const express = require('express')
const router = express.Router()
const homeController = require('./src/controllers/homeController')

//Rotes for login
router.get('/', homeController.login)
router.post('/auth', homeController.auth)
router.get('/logout', homeController.logout)

//Rotes for register user
router.get('/create', homeController.create)
router.post('/create/register', homeController.register)


//Rotes for recover password

//Here is the first route from recover password,
//It require the email
router.get('/recover-index', homeController.recoverIndex)
router.post('/recover-index/recover-email', homeController.recoverEmail)

//Here is the rotes for verify the code Sent on the last route
router.get('/recover-index-code', homeController.recoverIndexCode)
router.post('/recover-index-code/recover-code', homeController.recoverCode)

//Here is the last and the main route from recover password
//It updates the user password in DB
router.get('/recover-index-code/recover-code/recover-account-index', homeController.recoverAccountIndex)
router.post('/recover-index-code/recover-code/recover-account-index/recover', homeController.recoverAccount)


module.exports = router
