/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");

const accountSid = 'AC1525ab11cd0bee6ddf00adcfd47731a9';
const authToken = '7dfdd020ef42ca8dedd5415024a1fdb9';
const client = require('twilio')(accountSid, authToken);

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}





/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/sendSMS", async function (request, reply) {
  console.log(request.body?.sendNumber)
  try {
    const message = await client.messages
      .create({
        body: 'Dipprokash sardar',
        messagingServiceSid: 'MG392d12187791dc418b0d24d4e9e7771c',
        to: request.body?.sendNumber||'+916289766571'
      });

    return message;
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: error.message });
  }

}



);

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" }, //process.env.PORT
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
