require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const ClientError = require('./exceptions/ClientError');
const TokenManager = require('./tokenize/TokenManager');

const admin = require('./api/admin');
const AdminService = require('./services/AdminService');
const AdminValidator = require('./validator/admin');

const users = require('./api/users');
const UsersService = require('./services/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

const products = require('./api/products');
const ProductsService = require('./services/ProductsService');
const ProductsValidator = require('./validator/products');

const purchase = require('./api/purchase');
const PurchaseService = require('./services/PurchaseService');
const PurchaseValidator = require('./validator/purchase');

const redeem = require('./api/redeem');
const RedeemService = require('./services/RedeemService');
const RedeemValidator = require('./validator/redeem');

const init = async () => {
  const adminService = new AdminService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const productsService = new ProductsService();
  const purchaseService = new PurchaseService();
  const redeemService = new RedeemService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    }
  ]);

  server.auth.strategy('shop_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
        plugin: admin,
        options: {
          service: adminService,
          validator: AdminValidator,
        },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        adminService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: products,
      options: {
        service: productsService,
        validator: ProductsValidator,
      },
    },
    {
      plugin: purchase,
      options: {
        service: purchaseService,
        validator: PurchaseValidator,
      },
    },
    {
      plugin: redeem,
      options: {
        service: redeemService,
        validator: RedeemValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError){
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();