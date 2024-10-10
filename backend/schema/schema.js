const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLString},
        fname: {type: GraphQLString},
        lname: {type: GraphQLString},

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
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                id: {type: GraphQLString},
                fname: {type: GraphQLString},
                lname: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                console.log(`This is where user with id = ${args.id} fname = ${args.fname} and lname = ${args.lname} would be added to database`)
                return args;
            }

        }
    }
})

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})

module.exports = schema