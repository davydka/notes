require('dotenv').config();
const express = require('express');
const expressGraphQL = require('express-graphql');
const httpAuth = require('http-auth');
const schema = require('./schema');

const {
  mSERVERPORT,
  mAUTHUSER,
  mAUTHPASS
} = process.env;

const app = express();

const basic = httpAuth.basic({
    realm: "Can you handle notes?"
  }, (username, password, callback) => {
    // Custom authentication
    // Use callback(error) if you want to throw async error.
    callback(username === mAUTHUSER && password === mAUTHPASS);
  }
);

app.use(httpAuth.connect(basic));

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}));

app.listen(mSERVERPORT, () => {
  console.log(`listening on port: ${mSERVERPORT}`);
  console.log(`GraphiQL available at http://<host>:${mSERVERPORT}\\graphql`);
});

