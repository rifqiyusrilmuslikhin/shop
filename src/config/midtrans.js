const midtransClient = require('midtrans-client');

// Buat instance dari MidtransCoreApi dengan server key Midtrans Anda
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = snap;
