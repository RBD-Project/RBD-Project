const express = require('express')
const router = express.Router()
const homeController = require('./src/controllers/homeController')

//Rotas para login
router.get('/', homeController.login)
router.post('/auth', homeController.auth)
router.get('/logout', homeController.logout)

//Rotas para cadastro
router.get('/create', homeController.create)
router.post('/create/register', homeController.register)

//Rotas recuperar senha
router.get('/recover-index', homeController.recoverIndex)
router.post('/recover-index/recover-email', homeController.recoverEmail)
router.get('/recover-index-code', homeController.recoverIndexCode)
router.post('/recover-index-code/recover-code', homeController.recoverCode)
router.get('/recover-index-code/recover-code/recover-account-index', homeController.recoverAccountIndex)
router.post('/recover-index-code/recover-code/recover-account-index/recover', homeController.recoverAccount)


module.exports = router