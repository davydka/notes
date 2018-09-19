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

const {
  Schema
} = mongoose;




/* MONGO */
mongoose.connect(`mongodb://${mUSER}:${mPASS}@${mHOST}:${mPORT}/${mDB}?authSource=admin`, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb');
});

const noteSchema = new Schema({
  // id: Schema.Types.ObjectId,
  id: String,
  title: String,
  content: String
});

const Note = mongoose.model('Note', noteSchema);

// select * from notes
Note.find(function (err, notes) {
  if (err) return console.error(err);
  console.log(notes);
});

/*
Note.findOne({ _id: "5b9bcaf3999b449167925374" }, function (err, note) {
  if (err) return console.error(err);
  console.log(note);
});
*/

/*
const mainNote = new Note({
  title: 'Main Note',
  content: 'lorem ipsum dolor'
});
console.log(mainNote);
// mongoose.save?
*/

/* END MONGO */




/* GraphQL */
const NotesType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    note: {
      type: NotesType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return new Promise((resolve, reject) => {
          Note.findOne({ _id: args.id }, function (err, note) {
            if (err) { 
              console.error(err);
              resolve(err);
              return;
            }
            else {
              console.log(note);
              resolve(note);
            }
          });
        });
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNote: {
      type: NotesType,
      args: {
        title: { type: GraphQLString },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { title, content }) {
        return new Promise((resolve, reject) => {
          const newNote = new Note({
            title: title,
            content: content
          });

          newNote.id = newNote._id;
          // resolve(newNote);
          newNote.save(function (err, note) {
            if (err) { 
              console.error(err);
              resolve(err);
              return;
            }
            else {
              console.log(note);
              resolve(note);
            }
          });
        });
      }
    },
    editNote: {
      type: NotesType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve(parentValue, { id, title, content }) {
        return new Promise((resolve, reject) => {
          Note.findOne({ _id: id }, function (err, note) {
            if (err) {
              console.error(err);
              resolve(err);
              return;
            }
            
            note.title = title;
            note.content = content;
            note.save(function (err, updatedNote) {
              if (err) { 
                console.error(err);
                resolve(err);
                return;
              }
              else {
                console.log(updatedNote);
                resolve(updatedNote);
              }
            });
          });
        });
      }
    },
    deleteNote: {
      type: NotesType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return new Promise((resolve, reject) => {
          Note.deleteOne({ _id: id }, function (err) {
            if (err) {
              console.error(err);
              resolve(err);
              return;
            }
            resolve({ message: `${id} has been deleted.` });
          });
        });
      }
    }
  }

});
/* END GraphQL */









module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
