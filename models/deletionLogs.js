const mongoose = require('mongoose');
const deletionLogSchema = new mongoose.Schema({
    entity: {
    type: String,
    required: true
    },
    entity_id: {
    type: Number,
    required: true
    },
    deleted_at: {
    type: Date,
    default: Date.now
    },
    reason: {
    type: String,
    },
    data: {
    type: Object,
    required: true
    },
});
module.exports = mongoose.model("DeletionLog", deletionLogSchema)