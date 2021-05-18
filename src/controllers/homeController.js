const {Login} = require('../models/loginModel')

//Login

//Get controller for login
//Here if the user is loged the function will return to a home page
// If the user is not loged the function will return the login page
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

//Post controller for login
//Here the function responsability is to verify the errors and show them in the scream
//also the function pass the responsability off login to a model class
exports.auth = async (req, res) => {
    try {
        const login = new Login(req.body)
        await login.auth()

        if(login.errors.length > 0){
            req.flash('errors', login.errors)
            req.session.save(function() {
                return res.redirect('back')
            })
        } else {
            req.session.user = login.user
            return res.redirect('/')
        }

    } catch (e) {
        console.log(e)
        res.render('404')
    }

    return
}

//Get controller for logout
//Here the function logout the user, but if the user try to logout
//without beeing logged, the function will return the login page
exports.logout = (req, res) => {
    if (!req.session.user) res.render('login')
    req.session.user = null
    return res.redirect('/')
}

//CREATE USER

//Get controller for create user
exports.create = (req, res) => {
    res.render('create')
}

//Post controller for create usr
//Here the functiont will check errors and pass the responsability of create
//the user to login models
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


//RECOVER PASSWORD

//Get for the recover index
//where the user can type his email
exports.recoverIndex = (req, res) => {
    res.render('recoverEmail')
}

//Post for the recover index
//here the function will make sure that is no error
//Also the function will pass the responsability of send the email
//for the login model
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

//Get route for recover code
//Here the function will verify if the user had pass from the email part
exports.recoverIndexCode = (req, res) => {
    if(!req.session.code) return res.redirect('/recover-index')
    res.render('recoverCode')
}

//Post route for recover code
//here the function will make sure that is no error
//Also the function will check if the code sent is correct
exports.recoverCode = (req, res) => {
    if(!req.session.code) return res.redirect('/recover-index')

    //getting cleanned data
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

//Get route for recover password account
//Here the function before sending the response to client, will check if
//the user passed to the process before
exports.recoverAccountIndex = (req, res) => {
    if( req.session.flag !== true) res.redirect('/')
    res.render('recover')
}

//Post route for recover password account
//Here will muke sure if there is no error
//also the function will pass the responsability of recover to login model
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
