const { Role } = require('../models');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

class RoleRepository {
    async getRoleByName(name) {
        try {
            const role = await Role.findOne({
                where: {
                    name: name
                }
            });
            return role;
        } catch (error) {
            throw new AppError('Something went wrong fetching the role', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = RoleRepository;