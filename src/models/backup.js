const bcryptjs = require('bcryptjs')
const Sequelize = require('sequelize')
const nodemailer = require('nodemailer')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
})

const Model = Sequelize.Model;
class User extends Model {}
User.init({
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user'
})

exports.Login = class Login{
    constructor(body){
        this.body = body
        this.user = null
        this.errors = []
    }

    //CADASTRO
    async register(){
        this.validaRegister()
    
        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        
        try {
            await User.sync()
            await sequelize.authenticate()  //Testando conexao

            this.user = await User.findOne({ where: { email: this.body.email } })
            if(this.user) this.errors.push('Usuario ja existente!')

            if(this.errors.length > 0) return

            return await User.create({ email: this.body.email, password: this.body.password }).then(user => {
                console.log("user ID:", user.id);
            })          
        } catch (e) {
            console.error('Conexao falha!', e)
        }
    
        return 
    }

    validaRegister(){
        //Coletando cleaned data
        for(let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = ''
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password,
            password2: this.body.password2
        }

        //Fazendo Verificacao com a cleaned data
        if (this.body.email.length < 0){  //TODO: fazer vericacao email
            this.errors.push('Email invalido!')
        }

        if (this.body.password.length < 6) {
            this.errors.push('Senha muito curta!')
        }

        if (this.body.password2 !== this.body.password){
            this.errors.push('Senhas diferentes!')
        }
    }

    //LOGIN
    async auth() {
        try {
            await sequelize.authenticate()  //Testando conexao
            if(this.errors.length > 0) return
            
            this.user = await User.findOne({ where: { email: this.body.email } })
            
            if(!this.user){
                this.errors.push('Senha ou Usuario Invalido!')
                return
            }
        
            if (!bcryptjs.compareSync(this.body.password, this.user.password)){
                this.errors.push('Senha ou Usuario Invalido!')
                return
            }

        } catch (e) {
            console.error('Conexao falha!', e)
        }
    }

}

exports.RecoverPassword = class RecoverPassword{
    constructor(body, session){
        this.body = body
        this.session = session
        this.error = null
        this.user = null
    }

    async sendEmail(){
        this.session.code = Math.floor(Math.random() * 99999999)
        this.getCleanneData()

        try {
            await sequelize.authenticate()  //Testando conexao
            this.user = await User.findOne({ where: { email: this.body.email } })
    
            if(this.user){
                this.error = 'Email não encontrado!'
                return
            }
        } catch (e) {
            console.error('Conexao falha!', e)
        }

        const remetente = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: false,
                auth: {
                user: 'login.emmaill@gmail.com',
                pass: 'Lg759236' 
            }
        })
    
        const email = {
            from: 'login.emmaill@gmail.com',
            to: this.body.email,
            subject: 'Recuperacao de senha',
            text: `Your code is ${this.session.code}`,
        }

        await remetente.sendMail(email, function(error) {
            if (error) {
                console.log(error);
            }
        })
    }

    recover(){
        this.getCleanneData()

        if (this.body.newPassword.length <= 0 || this.body.newPassword2 <= 0){
            this.error = 'Senha(s) Invalida(s)!'
            return
        }
        
        if (this.body.newPassword !== this.body.newPassword2) {
            this.error = 'Senhas Diferentes!'
            return
        }

        //TODO:Autualizar tabela
    }

    getCleanneData(){
        for(let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = ''
            }
        }
    }
}
