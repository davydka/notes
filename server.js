require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const expressGraphQL = require('express-graphql');
// const schema = require('./schema/schema');

const {
  mUSER,
  mPASS,
  mHOST,
  mPORT,
  mDB
} = process.env;
mongoose.connect(`mongodb://${mUSER}:${mPASS}@${mHOST}:${mPORT}/${mDB}`, {
  useNewUrlParser: true
});
