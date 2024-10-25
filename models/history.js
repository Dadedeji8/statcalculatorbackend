const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const historySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    result: { type: String, required: true },
    location: { type: String },
    note: String,
    values: Array,
    date: { type: Date, required: true, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
});

// Export the model
module.exports = mongoose.model('History', historySchema);
