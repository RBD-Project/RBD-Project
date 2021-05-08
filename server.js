const express = require('express')
const app = express()

const routes = require('./routes')
const path = require('path')
const csrf = require('csurf')
const session = require('express-session')
const flash = require('connect-flash')
const Sequelize = require('sequelize');

app.use(express.urlencoded({ extended: true }));

const sessionOptions = session({
    secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(csrf())
const {checkCsrfError, csrfMiddleware, middlewareGlobal} = require('./src/middlewares/middlewares')
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(middlewareGlobal)

app.use(routes)
app.listen(3030, () => {
    console.log('Acessar http://localhost:3030')
    console.log('Servidor executando na porta 3030')
})
