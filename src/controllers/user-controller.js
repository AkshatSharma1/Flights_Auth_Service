const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { SuccessReponse, ErrorResponse } = require('../utils/common');

async function signup(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        
        SuccessReponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessReponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function signin(req, res) {
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        
        SuccessReponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessReponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

//is authenticated
async function isAuthenticated(req, res) {
    try {
        const token = req.headers['x-access-token'];
        const response = await UserService.isAuthenticated(token);
        
        SuccessReponse.data = response;
        return res.status(StatusCodes.OK).json(SuccessReponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    signup,
    signin,
    isAuthenticated
}