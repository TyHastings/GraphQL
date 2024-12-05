const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const { execute, subscribe } = require('graphql');
const cors = require('cors');
const schema = require('./schema/schema');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws')


const app = express();
app.use(cors());

const port = 3000;

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: {
        subscriptionEndpoint: `ws://localhost:${port}/graphql`,
    },
}));

const server = createServer(app);

const wsServer = new WebSocketServer({
    server, 
    path: '/graphql',
  });
  
  useServer(
    {
      schema,
      execute,
      subscribe,
      onConnect: async (ctx) => {
        console.log('Client connected:', ctx);
      },
      onDisconnect: async (ctx) => {
        console.log('Client disconnected:', ctx);
      },
      onError: (ctx, msg, errors) => {
        console.error('Subscription error:', errors);
      },
    },
    wsServer
  );
 
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`GraphQL subscriptions available at ws://localhost:${port}/graphql`);
  });