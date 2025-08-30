const Offer = require('../models/Offer');
const { body } = require("express-validator"); // <-- THIS
const { validationResult } = require('express-validator');
const connectDB = require("../utils/db");

const offerValidationRules = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2 })
            .withMessage('Name must be at least 2 characters long'),

        body('phone')
            .notEmpty()
            .withMessage('Phone number is required')
            .matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
            .withMessage('Please enter a valid phone number'),

        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .normalizeEmail(),

        body('propertyAddress')
            .notEmpty()
            .withMessage('Property address is required')
            .isLength({ min: 10 })
            .withMessage('Please enter a complete property address'),

        body('state')
            .notEmpty()
            .withMessage('State is required')
            .isLength({ min: 2, max: 2 })
            .withMessage('Please use the 2-letter state code'),

        body('zip')
            .notEmpty()
            .withMessage('ZIP code is required')
            .isPostalCode('US')
            .withMessage('Please enter a valid US ZIP code'),

        body('sellingReason')
            .notEmpty()
            .withMessage('Please provide a reason for selling')
            .isLength({ min: 10 })
            .withMessage('Please provide more details about your reason for selling'),

        body('sellingTimeframe')
            .isIn(['ASAP', 'Within 30 days', 'Within 60 days', 'Not urgent'])
            .withMessage('Please select a valid selling timeframe')
    ];
};

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    
    try {
        const rules = offerValidationRules(req, res)
        for (let rule of rules) {
            await rule.run(req);
        }

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await connectDB();
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