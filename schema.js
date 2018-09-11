require('dotenv').config();
const mongoose = require('mongoose');

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
