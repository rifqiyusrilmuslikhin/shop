require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const ClientError = require('./exceptions/ClientError');
const TokenManager = require('./tokenize/TokenManager');
const snap = require('./config/midtrans');

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

const orders = require('./api/orders');
const OrdersService = require('./services/OrdersService');
const OrdersValidator = require('./validator/orders');

const payment = require('./api/payment');
const PaymentValidator = require('./validator/payment');

const shipping = require('./api/shipping');
const ShippingService = require('./services/ShippingService');
const ShippingValidator = require('./validator/shipping');

const StorageService = require('./services/StorageService');

const CacheService = require('./services/CacheService');

const init = async () => {
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const cacheService = new CacheService();
  const adminService = new AdminService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const productsService = new ProductsService();
  const ordersService = new OrdersService(productsService, usersService);
  const shippingService = new ShippingService(cacheService);

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
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('shop_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => {
      const decodedToken = artifacts.decoded.payload;
      const { role } = decodedToken;
  
      if (role !== 'user' && role !== 'admin') {
        return { isValid: false };
      }
  
      return {
        isValid: true,
        credentials: {
          id: decodedToken.id,
          role: decodedToken.role,
        },
      };
    },
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
        productsService,
        storageService,
        validator: ProductsValidator,
      },
    },
    {
      plugin: orders,
      options: {
        ordersService,
        productsService,
        usersService,
        validator: OrdersValidator,
      },
    },
    {
      plugin: payment,
      options: {
        usersService,
        ordersService,
        snap,
        validator: PaymentValidator,
      },
    },
    {
      plugin: shipping,
      options: {
        shippingService,
        validator: ShippingValidator,
      }
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