const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const cors = require('cors')
const schema = require('./schema/schema')
var admin = require("firebase-admin");

var serviceAccount = require("../config/graphql-8e395-firebase-adminsdk-oxdmz-54fedf0083.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const database = admin.firestore();

const app = express()
app.use(cors())

const port = 3000

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true,
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))