const express = require('express');
const router = express.Router();
const {
    createOffer,
    getAllOffers,
    getOfferById,
    updateOfferStatus,
    deleteOffer
} = require('../controllers/offerController');
const { offerValidationRules } = require('../middleware/validation');

// @route   POST /api/offers
// @desc    Create a new cash offer request
// @access  Public
router.post('/', offerValidationRules(), createOffer);

// @route   GET /api/offers
// @desc    Get all cash offer requests
// @access  Public (in real app, should be protected)
router.get('/', getAllOffers);

// @route   GET /api/offers/:id
// @desc    Get single offer by ID
// @access  Public (in real app, should be protected)
router.get('/:id', getOfferById);

// @route   PUT /api/offers/:id/status
// @desc    Update offer status
// @access  Public (in real app, should be protected)
router.put('/:id/status', updateOfferStatus);

// @route   DELETE /api/offers/:id
// @desc    Delete an offer
// @access  Public (in real app, should be protected)
router.delete('/:id', deleteOffer);

module.exports = router;