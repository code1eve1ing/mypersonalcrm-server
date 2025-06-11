const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        buy: { type: Number, required: true },
        sell: { type: Number, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
