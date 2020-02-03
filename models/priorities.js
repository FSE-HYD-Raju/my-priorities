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


var Priorities = module.exports = mongoose.model('Priority', prioritiesSchema, 'priorities');

module.exports.getPriorities = function (callback) {
    Priorities.aggregate(
        [], function (err, data) {
            callback(err, data);
        }
    )
}