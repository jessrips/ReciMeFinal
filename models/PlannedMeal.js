//this is a mongodb schema for a planned meal which routes to plannedMeal.js and is rendered in mealPlanner.ejs

'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var plannedMealSchema = Schema( {
  item: String,
  dateTime: Date,
  createdAt: Date,
  userId: ObjectId
} );

module.exports = mongoose.model( 'PlannedMeal', plannedMealSchema );
