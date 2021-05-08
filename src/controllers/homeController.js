const {Login} = require('../models/loginModel')

//Login
exports.login = (req, res) => {
    if(req.session.user){
        res.render('home', {
            email: req.session.user.email
        })
        return
    }

    res.render('login')
    return
}

exports.auth = async (req, res) => {
    try {
        const login = new Login(req.body)
        await login.auth()
        req.session.user = login.user

        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(function() {
                return res.redirect('back')
            })
        } else {
            return res.redirect('/')
        }

    } catch (e) {
        console.log(e)
        res.render('404')
    }

    return
}

exports.logout = (req, res) => {
    if (!req.session.user) res.render('login')
    req.session.user = null
    return res.redirect('/')
}

//Cadastro
exports.create = (req, res) => {
    res.render('create')
}

exports.register = async (req, res) => {
    try {
        const login = new Login(req.body)
        await login.register()
        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(function() {
                return res.redirect('back')
            })
        } else {
            req.flash('sucess', 'Seu user foi criado!')
            req.session.save(function() {
                return res.redirect('/')
            })
        }
    } catch (e) {
        res.render('404')
        console.log(e)
    }

    return
}


//RECUPERAR SENHA
exports.recoverIndex = (req, res) => {
    res.render('recoverEmail')
}

exports.recoverEmail = async (req, res) => {
    try {
        const login = new Login(req.body, req.session)
        await login.sendEmail()

        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(function() {
                return res.redirect('back')
            })
        } else {
            return res.redirect('/recover-index-code')
        }
    } catch (e) {
        res.render('404')
        console.log(e)
    }
}

exports.recoverIndexCode = (req, res) => {
    if(!req.session.code) return res.redirect('/recover-index')
    res.render('recoverCode')
}

exports.recoverCode = (req, res) => {
    if(!req.session.code) return res.redirect('/recover-index')

    for(let key in req.body) {
        if (typeof req.body[key] !== 'string') {
            this.body[key] = ''
        }
    }
    req.body = {userCode: req.body.userCode}
    
    try {
        if (req.session.code !== Number(req.body.userCode)){
            req.flash('errors', 'Codigo Incorreto')
            req.session.save(function() {
                return res.redirect('back')
            })
        } else {
            req.session.flag = true  //Flag server para autorizar a entrada no /recover-index-code/recover-code/recover-account
            req.session.save(function() {
                return res.redirect('/recover-index-code/recover-code/recover-account-index')
            })
        }
    } catch (e) {
        console.log(e)
        res.render('404')
    }
}

exports.recoverAccountIndex = (req, res) => {
    if( req.session.flag !== true) res.redirect('/')
    res.render('recover')
}

exports.recoverAccount = async (req, res) => {
    try {
        const login = new Login(req.body, req.session)
        await login.recover()

        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(function() {
                return res.redirect('back')
            })
        } else {
            req.flash('sucess', 'Seu user autualizado!')
            req.session.save(function() {
                return res.redirect('/')
            })
        }

    } catch (error) {
        console.log(e)
        res.render('404')
    }
}