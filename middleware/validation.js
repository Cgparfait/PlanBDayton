const { body } = require('express-validator');

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

module.exports = {
    offerValidationRules
};