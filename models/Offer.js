const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    propertyAddress: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    zip: {
        type: String,
        required: true,
        trim: true
    },
    sellingReason: {
        type: String,
        required: true,
        trim: true
    },
    sellingTimeframe: {
        type: String,
        required: true,
        enum: ['ASAP', 'Within 30 days', 'Within 60 days', 'Not urgent'],
        default: 'Not urgent'
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Reviewed', 'Offer Made', 'Closed'],
        default: 'New'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);