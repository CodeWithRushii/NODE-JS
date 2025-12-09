const express = require('express');
const port = 9088;
const app = express();

let alltask = [];

let id = 1;

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.render('view', {
        alltask,
    });
});

app.get('/addtaskPage', (req, res) => {
    res.render('add');
});

app.post('/addtask', (req, res) => {
    const task = req.body;

    task.Id = id;
    id++;

    alltask.push(task);
    res.redirect('/');
});

app.get('/deletetask', (req, res) => {
    console.log(req.query);

    const Userid = req.query.Id;

    alltask = alltask.filter((task) => task.Id != Userid);

    res.redirect('/');
});

app.get("/editPage", (req, res) => {
    console.log(req.query);
    const task = alltask.find((task) => task.Id == req.query.Id);
    if (!task) {
        return res.redirect('/');
    }
    return res.render('edit', {
        task
    });
});

app.post('/edittask', (req, res) => {
    console.log(req.body);
    alltask = alltask.map((task) => {
        if (task.Id == req.body.Id) {
            return req.body;
        }
        else {
            return task;
        }
    })
    return res.redirect('/');
});

app.listen(port, (err) => {
    if (err) {
        console.log("Server Not Found!!!", err);
        return false;
    }
    console.log("Server IS started");
});