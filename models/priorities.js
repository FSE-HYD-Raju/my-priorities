var mongoose = require('mongoose');

var prioritiesSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true
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