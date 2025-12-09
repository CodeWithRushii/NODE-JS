const express = require('express');
const PORT = 9080;
const app = express();

let allUsers = [];

let id = 101;

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.render('displayuser', {
        name: "Rushi",
        allUsers,
    });
});

app.get('/addUserPage', (req, res) => {
    res.render('adduser');
});

app.post('/addUser', (req, res) => {
    const user = req.body;

    user.Id = id;
    id++;

    allUsers.push(user);
    res.redirect('/');
});

app.get('/deleteUser', (req, res) => {
    console.log(req.query);

    const Userid = req.query.Id;

    allUsers = allUsers.filter((User) => User.Id != Userid);

    res.redirect('/');
});

app.get("/editPage", (req, res) => {
    console.log(req.query);
    const user = allUsers.find((user) => user.Id == req.query.Id);
    if (!user) {
        return res.redirect('/');
    }
    return res.render('edituser', {
        user
    });
});

app.post("/editUser", (req, res) => {
    console.log(req.body);
    allUsers = allUsers.map((user) => {
        if (user.Id == req.body.Id) {
            return req.body;
        }
        else {
            return user;
        }
    })
    return res.redirect('/');
});

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server Not Found!!!", err);
        return false;
    }
    console.log("Server IS started");
});