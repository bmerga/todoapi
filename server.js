const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/todos");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5555;
app.use(express.json());

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI ||"mongodb://127.0.0.1"

})



mongoose
.connect(process.env.MONGODB_URI ||"mongodb://127.0.0.1")
.then(() => console.log("Succesfully connected to Mongo DB"))
.catch((error) => console.error("Could not connect to MongoDB", error));
// app.use("/api/auth", require("./routes/user"))
app.use("/api/todos", routes)
app.use("/api/admin", require("./routes/admin"))
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
});
