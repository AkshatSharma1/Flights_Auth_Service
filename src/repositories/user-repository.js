const { User } = require('../models');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

class UserRepository {
    
    async create(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
            if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
                let explanation = [];
                error.errors.forEach((err) => {
                    explanation.push(err.message);
                });
                throw new AppError(explanation, StatusCodes.BAD_REQUEST);
            }
            console.log("🔥 REPORTED ERROR:", error);
            throw new AppError('Something went wrong in the User Repo', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            return user;
        } catch (error) {
            throw new AppError('Something went wrong fetching the user', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    
    async get(id) {
        try {
            const user = await User.findByPk(id, {
                attributes: ['id', 'email'] // Security: Don't return password!
            });
            return user;
        } catch (error) {
            throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UserRepository;