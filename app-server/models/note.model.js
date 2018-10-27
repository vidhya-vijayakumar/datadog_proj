const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    Sales: String,
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);