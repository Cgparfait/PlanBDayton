const Offer = require('../models/Offer');
const { body } = require("express-validator"); // <-- THIS
const { validationResult } = require('express-validator');
const connectDB = require("../utils/db");

const offerValidationRules = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage('Name is required'),
            // .isLength({ min: 2 })
            // .withMessage('Name must be at least 2 characters long'),

        body('phone')
            .notEmpty()
            .withMessage('Phone number is required'),
            // .matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
            // .withMessage('Please enter a valid phone number'),

        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .normalizeEmail(),

        body('propertyAddress')
            .notEmpty()
            .withMessage('Property address is required'),

        body('state')
            .notEmpty()
            .withMessage('State is required'),

        body('zip')
            .notEmpty()
            .withMessage('ZIP code is required'),

        body('sellingReason')
            .notEmpty()
            .withMessage('Please provide a reason for selling'),

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
        // send mail
        try {
            const response = await fetch("https://planbdayton.com/api/send-mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    propertyAddress,
                    state,
                    zip,
                    sellingReason,
                    sellingTimeframe,
                }),
            });

            const result = await response.json();
            console.log("Server response:", result);
        } catch (err) {
            console.error("Error sending request:", err);
        }

        res.status(201).json({
            message: 'Cash offer request submitted successfully',
            data: savedOffer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};