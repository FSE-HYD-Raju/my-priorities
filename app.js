var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
var cors = require('cors');
app.use(cors());

app.use(bodyParser.json());


Priorities = require('./models/priorities');
User = require('./models/user');


//connect to Mongoose
var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
var mongodbUri = 'mongodb+srv://priorities_admin:P79GDINDszDBWAkD@cluster0-5l46f.mongodb.net/priorities_db?retryWrites=true&w=majority';

mongoose.connect(mongodbUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :'));


db.once('open', function () {
    app.post('/login', function (req, res) {
        var obj = req.body;
        User.authorizeUser(obj, function (err, suc) {
            if (err) {
                res.json(err);
            }
            res.json(suc);
        });
    });

    app.post('/updateProfile', function (req, res) {
        var obj = req.body;
        User.updateUserProfile(obj, function (err, suc) {
            if (err) {
                res.json(err);
            }
            console.log(suc);
            res.json(suc);
        });
    });

    app.get('/forgotPwd/:email', function (req, res) {
        var email = req.params.email ? req.params.email : "tagBMB@gmail.com";
        User.forgotPwd(email, function (err, suc) {
            if (err) {
                res.json(err);
            }
            res.json(suc);
        });
    });

    app.post('/register', function (req, res) {
        var obj = req.body;
        User.addUser(obj, function (err, suc) {
            if (err) {
                res.json(err);
            }
            res.json(suc);
        });
    });

    app.get('/priorities/:uid', function (req, res) {
        Priorities.getPriorities(req.params.uid, function (err, priorities) {
            if (err) {
                console.log(err);
            }
            res.json(priorities);
        });
    });

    app.get('/', function (req, res) {
        res.send("Hey Raj!");
    });

    app.post('/post_priorities', function (req, res) {
        var priorities = req.body;
        Priorities.postPriorities(priorities, function (err, suc) {
            if (err) {
                res.json(err);
            }
            res.json(suc);
        })
    });

    app.post('/update_priorities', function (req, res) {
        var priorities = req.body;
        Priorities.updatePriorities(priorities, function (err, suc) {
            if (err) {
                res.json(err);
            }
            res.json(suc);
        })
    });

    app.post('/delete_priorities/:_id', function (req, res) {
        Priorities.deletePriorities(req.params._id, function (err, book) {
            if (err) {
                console.log(err);
            }
            res.json(book);
        });
    });


    app.listen(process.env.PORT || 5000);
    console.log('Running on port 3000')
});