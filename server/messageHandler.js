const { errors } = require('./errors');

/**
 * 
 * @param {string} errCode 
 * @param {Object} args 
 */
exports.formatError = (errCode = '-1') => {
    
    return {
        d: {
            'error': errors[errCode] ? errCode != '-1' : errors.default,
            errCode,
        }
    }
}
