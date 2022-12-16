const express = require("express");
const cors = require("cors");
const colors = require("colors");
require("dotenv").config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Server is Connected")
})

const userName = process.env.Database_User_Name;
const userPassword = process.env.Database_User_Password;
console.log(userName, userPassword);

const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.wfsi327.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function dbConnect() {
    try {
        await client.connect()
        console.log("Database connect".blue)
    } catch (error) {
        console.log(error.name.bgRed, error.message.yellow)
    }
}

dbConnect()

// Database Collection Name 
const services = client.db("myPortfolioWebsite").collection("services");
const projects = client.db("myPortfolioWebsite").collection("projects");


app.post("/addService", async (req, res) => {
    try {
        const data = req.body;
        const result = await services.insertOne(data)
        console.log(result);
        if (result.acknowledged) {
            res.send({
                success: true,
                message: "service add to database successful"
            })
        }

    } catch (error) {
        console.log(error.name.bgRed, error.message.yellow);
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.post("/addProject", async (req, res) => {
    try {
        const data = req.body;
        const result = await projects.insertOne(data)
        console.log(result);
        if (result.acknowledged) {
            res.send({
                success: true,
                message: "service add to database successful"
            })
        }

    } catch (error) {
        console.log(error.name.bgRed, error.message.yellow);
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.get("/myServices", async (req, res) => {
    try {
        const query = {};
        const data = await services.find(query).toArray()
        res.send(data)
    } catch (error) {
        console.log(error.name.bgRed, error.message.yellow);
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.get("/myProjects", async (req, res) => {
    try {
        const query = {};
        const data = await projects.find(query).toArray()
        res.send(data)
    } catch (error) {
        console.log(error.name.bgRed, error.message.yellow);
        res.send({
            success: false,
            message: error.message
        })
    }
})


app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})