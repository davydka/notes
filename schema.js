require('dotenv').config();
const graphql = require('graphql');
const mongoose = require('mongoose');

const {
  mUSER,
  mPASS,
  mHOST,
  mPORT,
  mDB
} = process.env;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

mongoose.connect(`mongodb://${mUSER}:${mPASS}@${mHOST}:${mPORT}/${mDB}?authSource=admin`, {
  useNewUrlParser: true
});

// mongo schema
const TODO = mongoose.model('Todo', {
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  completed: Boolean
})

  /*
var newTodo = new TODO({
  title: args.title,
  completed: false
})
newTodo.id = newTodo._id
*/

  /*
var TodoType = new GraphQLObjectType({  
  name: 'Todo',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => {
        return new Promise((resolve, reject) => {
          TODO.find((err, todos) => {
            if (err) reject(err)
            else resolve(todos)
          })
        })
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation
});
*/
