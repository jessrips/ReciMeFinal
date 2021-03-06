//this is a mongodb schema for a user profile

'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;


var userSchema = Schema( {
  googleid: String,
  googletoken: String,
  googlename:String,
  googleemail:String,
  username:String,
  age:Number,
  imageURL: String,
} );

module.exports = mongoose.model( 'User', userSchema );
