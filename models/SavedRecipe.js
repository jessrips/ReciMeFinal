//this is a mongodb schema for a saved recipe which routes to savedRecipes.js and is rendered in sRecipes.ejs

'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var savedRecipeSchema = Schema( {
  item: String,
  difficulty: String,
  sourceLink: String,
  recipeType: String,
  createdAt: Date,
  userId: ObjectId
} );

module.exports = mongoose.model( 'SavedRecipe', savedRecipeSchema );
