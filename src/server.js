const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const PORT = process.env.PORT || 8000; //use port 8000 if PORT is unavailable. PORT = required for deployment, 8000 = local

const app = express(); // init express
const server = http.Server(app);
const io = socketio(server);

//TODO: Add JWT token ok
//TODO: Return token when logging in ok
//TODO: Send token on request ok
//TODO: Create function to protect routers
//TODO: Add function /middleware to routers
//TODO: Modify response to decode the token

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //if server is started as dev env, dotenv will be imported
}

try {
  mongoose.connect(process.env.MONGO_DB_SECRET_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true, //config for connecting to mdb
  });
  console.log("MongoDB connected Successfully");
} catch (error) {
  throw Error(`Error while while connecting to DB: ${error}`);
}

const connectUsers = {};

io.on("connection", (socket) => {
  console.log("User is connected", socket.id);
  console.log(socket.handshake.query);
  const { user } = socket.handshake.query;
  connectUsers[user] = socket.id;
});

app.use((req, res, next) => {
  req.io = io;
  req.connectUsers = connectUsers;
  return next();
});
app.use(cors());
// Body parser middleware
app.use(express.json()); //Allows handling of raw JSON, returns a middleware that passes a json as a response.

app.use("/files", express.static(path.resolve(__dirname, "..", "files")));
app.use(routes);
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
