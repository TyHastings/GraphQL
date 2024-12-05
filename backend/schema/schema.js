const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLBoolean } = graphql
var admin = require("firebase-admin");

const { PubSub } = require('graphql-subscriptions')
const pubSub = new PubSub();


var serviceAccount = require("../../config/graphql-8e395-firebase-adminsdk-oxdmz-54fedf0083.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const database = admin.firestore();

database.collection('messages').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        pubSub.publish('MESSAGE_ADDED', {
          messageAdded: change.doc.data(),
        });
      }
    });
  });


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        fname: {type: GraphQLString},
        lname: {type: GraphQLString},

    }
})

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: {
        id: {type: GraphQLString},
        content: {type: GraphQLString},
        userID: {type: GraphQLString},
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return {id: '1', fname: 'Ty', lname: 'Hastings'};
            }
        },
        getUsers: {
            type: new GraphQLList(UserType),
            resolve: async () => {
                const snapshot = await database.collection('user').get()
                return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
            }
        },
        getMessages: {
            type: new GraphQLList(MessageType),
            resolve: async () => {
                const snapshot = await database.collection('messages').get();
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            },
        },
    }
})


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addMessage: {
            type: MessageType,
            args: {
              content: { type: GraphQLString },
              userID: { type: GraphQLString },
            },
            resolve(_, { content, userID }) {
              const newMessageRef = database.collection('messages').add({
                content,
                userID,
              });
              return newMessageRef.then((docRef) => {
                return docRef.get().then(doc => doc.data());
              });
            },
          },
        addUser: {
            type: UserType,
            args: {
                fname: {type: GraphQLString},
                lname: {type: GraphQLString}
            },
            resolve: async (parentValue, args) => {
                const user = {fname: args.fname, lname: args.lname}
                const doc = await database.collection('user').add(user);
                return { id: doc.id, ...user}
            }
        },
        deleteUser: {
            type: GraphQLBoolean,
            args: {
                id: {type: GraphQLString},
            },
            resolve: async(parentValue, args) => {
                try {
                    await database.collection('user').doc(args.id).delete()
                    return true
                } catch(error) {
                    console.log(error)
                    return false
                }
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: {type: GraphQLString},
                fname: {type: GraphQLString},
                lname: {type: GraphQLString}
            },
            resolve: async(parentValue, args) => {
                try {
                    const user = database.collection('user').doc(args.id)
                    await user.update({fname: args.fname, lname: args.lname})
                    const updatedUser = user.get()
                    return { id: updatedUser.id, ...updatedUser.data()}
                } catch(error) {
                    console.log(error)
                }
            }
        },
    }
})

const Subscription = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      messageAdded: {
        type: MessageType,
        subscribe: () => pubSub.asyncIterableIterator('MESSAGE_ADDED')
      },
    },
  });

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
    subscription: Subscription,
})

module.exports = schema