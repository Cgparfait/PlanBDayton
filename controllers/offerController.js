const Offer = require('../models/Offer');
const { validationResult } = require('express-validator');

// Create a new cash offer request
exports.createOffer = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            phone,
            email,
            propertyAddress,
            state,
            zip,
            sellingReason,
            sellingTimeframe
        } = req.body;

        // Create new offer
        const offer = new Offer({
            name,
            phone,
            email,
            propertyAddress,
            state,
            zip,
            sellingReason,
            sellingTimeframe
        });

        const savedOffer = await offer.save();
        res.status(201).json({
            message: 'Cash offer request submitted successfully',
            data: savedOffer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all offers
exports.getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.status(200).json({
            count: offers.length,
            data: offers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single offer by ID
exports.getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.status(200).json({ data: offer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update offer status
exports.updateOfferStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        res.status(200).json({
            message: 'Offer status updated successfully',
            data: offer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};