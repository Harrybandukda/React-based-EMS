const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const schemaDefs = require('./src/graphql/schema');
const rootResolvers = require('./src/graphql/resolvers');
const authenticate = require('./src/middleware/auth');

const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

const graphqlServer = new ApolloServer({
  typeDefs: schemaDefs,
  resolvers: rootResolvers,
  context: ({ req }) => authenticate(req),
  formatError: (err) => {
    console.error('❗ GraphQL Error:', err);
    return { message: err.message, path: err.path };
  }
});

async function bootstrap() {
  await graphqlServer.start();

  graphqlServer.applyMiddleware({ app, path: '/graphql', cors: false });

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Database connection established'))
  .catch(error => console.error('❌ DB Connection Failed:', error));

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening: http://localhost:${PORT}`);
    console.log(`🔗 GraphQL endpoint: http://localhost:${PORT}${graphqlServer.graphqlPath}`);
  });
}

bootstrap();
