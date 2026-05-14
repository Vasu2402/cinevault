const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { verifyToken } = require('../config/jwt');
const { User } = require('../models');

const createApolloServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      let user = null;
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      
      if (token) {
        try {
          const decoded = verifyToken(token);
          user = await User.findByPk(decoded.id);
        } catch (error) {
          console.error('GraphQL Auth Error:', error.message);
        }
      }
      return { user };
    },
  }));
};

module.exports = createApolloServer;
