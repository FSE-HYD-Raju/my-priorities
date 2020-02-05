var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
    },
    otp: {
        type: String
    },
    created_date: {
        type: Date,
        default: null
    },
    updated_date: {
        type: Date,
        default: null
    }
});

var User = module.exports = mongoose.model('users', userSchema);

module.exports.authorizeUser = function (obj, callback) {
    User.count({ 'email': obj.email }, function (err, docs) {
        if (err) { callback({ erroMsg: "ERROR" }) };
        if (!docs) {
            callback({ erroMsg: "NOTFOUND" });
        } else {
            User.findOne({ 'email': obj.email, 'password': obj.password }
                , '_id email name created_date updated_date', callback);
        }
    });
}

module.exports.addUser = function (obj, callback) {
    User.count({ 'email': obj.email }, function (err, docs) {
        if (err) { callback({ erroMsg: "ERROR" }) };
        if (!docs) {
            obj.created_date = new Date();
            User.create(obj).then(function (res, err) {
                User.forgotPwd(obj.email, callback);
            });
        } else {
            callback({ erroMsg: "INVALID" });
        }
    });
}

module.exports.updateUser = function (id, user, options, callback) {
    var query = { _id: id };
    var update = {
        name: user.name,
        email: user.title,
        password: user.password,
        updated_date: new Date()
    }
    User.findOneAndUpdate(query, update, options, callback);
}

module.exports.updateUserProfile = function (user, callback) {
    console.log(user);
    if (user.newPassword) {
        var query = { email: user.email, password: user.password };
        var update = {
            password: user.newPassword,
            updated_date: new Date(),
            otp: null
        }
        if (user.name) update.name = user.name;
    } else {
        var query = { email: user.email };
        var update = {
            name: user.name,
            updated_date: new Date()
        }
    }
    console.log(update);
    console.log(query);
    User.findOneAndUpdate(query, update, { new: true, "fields": { "_id": 1, "email": 1, "name": 1, "created_date": 1, "updated_date": 1 }, }, callback);
}

module.exports.registerNewPassword = function (user, callback) {
    console.log(user);
    var query = { email: user.email, otp: user.otp }

    var update = {
        password: user.newPassword,
        updated_date: new Date(),
        otp: null
    }

    console.log(update);
    console.log(query);
    User.findOneAndUpdate(query, update, { new: true, "fields": { "_id": 1, "email": 1, "name": 1, "created_date": 1, "updated_date": 1 }, }, callback);
}

module.exports.deleteUser = function (id, callback) {
    var query = { _id: id };
    User.remove(query, callback);
}

module.exports.forgotPwd = function (email, callback) {
    var pwd = makeid();
    console.log("pwd" + pwd);

    var query = { email: email };
    var update = {
        otp: pwd,
        updated_date: new Date()
    }
    User.findOneAndUpdate(query, { $set: update }, { new: true }, function (err, doc, res) {
        console.log(err);
        console.log(doc);
        console.log(res);
        if (err || !doc) {
            callback(err, res);
        } else {

            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'TAGBMB@gmail.com',
                    clientId: "754770916238-ik94iu4rmm873qu7s4gnpf030ap0o0k2.apps.googleusercontent.com",
                    clientSecret: "Kxt1R5AufJ6LlaJRsV4xpvuZ",
                    refreshToken: "1//0gyBGlxnfG2gdCgYIARAAGBASNwF-L9IrWEXghnDk6n5HUEQCzmGONRP9p3YbAB1tNS3GTcs9XYTpDgvjTE43ryn-PAO_tSu5S2E",
                    accessToken: "ya29.Il-6BxuJEGrdeZD9Ux8g4vjWqUyr473jdq5-aUS43NBF8G2Jslxi1pnTDr_cJyBsFMMgNBVCMWhxTr3O4tBf9E9SFcvzzYMT4i09LnRlsSrcWwK_z7Gbm1h5Nf-lKqBcpw",
                    expires: 1579206236301
                }
            });
            var mailOptions = {
                from: 'TAGBMB@gmail.com',
                to: email,
                bcc: 'akhilgoud616@gmail.com',
                subject: 'BUY MY BOOK - OTP',
                html: '<br/><h2>Please use this below OTP- </h2> <br/><h1>' + pwd + '</h1>'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
                callback(error, info);
            });
        }
    });


}

function makeid() {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
