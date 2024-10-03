const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const cors = require('cors')
const schema = require('./schema/schema')

const app = express()
app.use(cors())

const port = 3000

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true,
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))