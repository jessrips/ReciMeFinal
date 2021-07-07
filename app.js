const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const layouts = require("express-ejs-layouts");
//const auth = require('./config/auth.js');


const mongoose = require( 'mongoose' );
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);
mongoose.connect( 'mongodb://localhost/authDemo');
//const mongoDB_URI = process.env.MONGODB_URI
//mongoose.connect(mongoDB_URI)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("successfully connected :)")
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const savedRecipesRouter= require('./routes/savedRecipes');
const mealPlannerRouter = require('./routes/plannedMeals');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(layouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/savedRecipes', savedRecipesRouter);
app.use('/plannedMeals', mealPlannerRouter);

app.get('/profiles',
    isLoggedIn,
    async (req,res,next) => {
      try {
        res.locals.profiles = await User.find({})
        res.render('profiles')
      }
      catch(e){
        next(e)
      }
    }
  )

  app.get("/author", (request,response) => {
    response.render("author")
  })
  app.get("/form", (request,response) => {
    response.render("form")
  })

  app.post("/convertMeasures", (request,response) => {
    const type1 = request.body.type1
    const ogAmount = parseFloat(request.body.type1amount)
    const type2 = request.body.type2
    let result = 0
    if (type1 == "pints" && type2 == "cups"){
      result = ogAmount*2
    }
    else if(type1 == "pints" && type2 == "tablespoons"){
      result = ogAmount*32
    }
    else if(type1 == "pints" && type2 == "pints"){
      result = ogAmount
    }
    else if(type1 == "cups" && type2 == "pints"){
      result = ogAmount/2
    }
    else if(type1 == "cups" && type2 == "tablespoons"){
      result = ogAmount*16
    }
    else if(type1 == "cups" && type2 == "cups"){
      result = ogAmount
    }
    else if(type1 == "tablespoons" && type2 == "cups"){
      result = ogAmount/16
    }
    else if(type1 == "tablespoons" && type2 == "pints"){
      result = ogAmount/32
    }
    else if(type1 == "tablespoons" && type2 == "tablespoons"){
      result = ogAmount
    }
    response.locals.result = result
    response.locals.type1 = type1
    response.locals.type1amount = ogAmount
    response.locals.type2 = type2
    response.render('convertedResult')
  })

app.use('/publicprofile/:userId',
    async (req,res,next) => {
      try {
        let userId = req.params.userId
        res.locals.profile = await User.findOne({_id:userId})
        res.render('publicprofile')
      }
      catch(e){
        console.log("Error in /profile/userId:")
        next(e)
      }
    }
)


app.get('/profile',
    isLoggedIn,
    (req,res) => {
      res.render('profile')
    })

app.get('/editProfile',
    isLoggedIn,
    (req,res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req,res,next) => {
      try {
        let username = req.body.username
        let age = req.body.age
        req.user.username = username
        req.user.age = age
        req.user.imageURL = req.body.imageURL
        await req.user.save()
        res.redirect('/profile')
      } catch (error) {
        next(error)
      }

    })


app.use('/data',(req,res) => {
  res.json([{a:1,b:2},{a:5,b:3}]);
})

const User = require('./models/User');

app.get("/test",async (req,res,next) => {
  try{
    const u = await User.find({})
    console.log("found u "+u)
  }catch(e){
    next(e)
  }

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
