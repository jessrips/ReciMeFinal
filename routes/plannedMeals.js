/*
  plannedMeals.js -- Router for the PlannedMeal
*/
const express = require('express');
const router = express.Router();
const PlannedMeal = require('../models/PlannedMeal')


//checking for log in

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* add the value in the body (mealPlanner.ejs) to the list associated to the key */
router.post('/',
  isLoggedIn,
  async (req, res, next) => {
      const meal = new PlannedMeal(
        {item:req.body.item,
          dateTime:req.body.dateTime,
          createdAt: new Date(),
          userId: req.user._id
        })
      await meal.save();
      res.redirect('/plannedMeals')
});

//functionality to remove item from collection
router.get('/remove/:itemId',
  isLoggedIn,
  async (req, res, next) => {
      await PlannedMeal.remove({_id:req.params.itemId});
      res.redirect('/plannedMeals')
});


// get the value associated to the key (and sorts)
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.items = await PlannedMeal.find({userId:req.user._id}).sort({"dateTime": 1}) //sorts collection by date (var dateTime)
      res.render('mealPlanner');
});


module.exports = router;
