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

const schema = new GraphQLSchema({
    query: RootQuery,
})

module.exports = schema