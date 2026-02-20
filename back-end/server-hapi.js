const Hapi = require("@hapi/hapi");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/hapi/contactRoutes");
require("dotenv").config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT_HAPI || 5001,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type"],
        additionalHeaders: ["X-Requested-With"],
      },
    },
  });

  // Connect to MongoDB
  await connectDB();

  // Register routes
  server.route(contactRoutes);

  // Health check
  server.route({
    method: "GET",
    path: "/",
    handler: () => ({ message: "Contact API (Hapi) is running" }),
  });

  await server.start();
  console.log(`Hapi server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
