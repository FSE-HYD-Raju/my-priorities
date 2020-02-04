var mongoose = require('mongoose');

var prioritiesSchema = mongoose.Schema({
    uid: {
        type: String,
        required: false
    },
    priorities: {
        dofirst: Array,
        dolater: Array,
        delegate: Array,
        eleminate: Array,
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


var Priorities = module.exports = mongoose.model('priorities', prioritiesSchema);

module.exports.getPriorities = function (id, callback) {
    Priorities.find({ 'uid': id }).lean()
        .exec(function (err, usersDocuments) {
            callback(err, usersDocuments);
        });
}

module.exports.postPriorities = function (priorities, callback) {
    priorities.created_date = new Date();
    Priorities.create(priorities, callback);
}

module.exports.updatePriorities = function (priorities, callback) {
    var query = { _id: priorities._id };
    Priorities.findOneAndUpdate(query, priorities, { new: true }, callback);
}

module.exports.deletePriorities = function (id, callback) {
    var query = { _id: id };
    Priorities.remove(query, callback);
}