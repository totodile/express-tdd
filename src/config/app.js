require('../database')

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const passport = require('passport')
const initializePassport = require('../config/passport')

const webRouter = require('../routes/web')
const apiRouter = require('../routes/api')

const app = express()

initializePassport(passport)

// view engine setup
app.set('views', path.join('src', 'views'))
app.set('view engine', 'pug')

app.use(flash())
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join('src', 'public')))

app.use('/', webRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
