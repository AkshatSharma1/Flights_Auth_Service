const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes'); 
const AppError = require('../../utils/errors/app-error'); 
const { JWT_SECRET, JWT_EXPIRY } = require('../../config/server-config');

function createToken(input) {
    try {
        return jwt.sign(input, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    } catch(error) {
        throw new AppError('Something went wrong in token creation', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch(error) {
        throw error;
    }
}

function checkPassword(plainPassword, encryptedPassword) {
    try {
        return bcrypt.compareSync(plainPassword, encryptedPassword);
    } catch(error) {
        throw error;
    }
}

module.exports = {
    createToken,
    verifyToken,
    checkPassword
}