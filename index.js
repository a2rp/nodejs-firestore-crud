const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid")

const { db, usersDB } = require("./connect.db");
// console.log(db);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home
app.get("/api/v1/a2rp", (req, res) => {
    res.json({
        status: true,
        message: "a2rp: an Ashish Ranjan presentation"
    });
});

// create
app.post("/api/v1/create", async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const user = { firstName, lastName, email };
        const response = await usersDB.doc(uuidv4()).set(user);
        res.json({
            status: true,
            response
        });
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
});

// read all
app.get("/api/v1/users", async (req, res) => {
    try {
        const response = await usersDB.get();
        const usersList = [];
        response.forEach(doc => {
            usersList.push({
                id: doc.id,
                ...doc.data()
            });
        });
        res.json({
            status: true,
            usersList
        });
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
});

// read one
app.get("/api/v1/users/:id", async (req, res) => {
    try {
        const userRef = usersDB.doc(req.params.id);
        const response = await userRef.get();
        const user = response.data();
        res.json({
            status: true,
            user,
            id: userRef.id
        });
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
});

// update
app.patch("/api/v1/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { firstName, lastName, email } = req.body;
        const response = await usersDB.doc(id).update(req.body);
        res.json({
            status: true,
            response
        });
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
});

// delete
app.delete("/api/v1/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const response = await usersDB.doc(id).delete();
        res.json({
            status: true,
            response
        });
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        });
    }
});

const PORT = 1198;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
