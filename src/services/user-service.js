const { UserRepository, RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { verifyToken, createToken, checkPassword } = require('../utils/common/helpers');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

// --- 1. SIGNUP LOGIC ---
async function create(data) {
    try {
        // Step A: Create the User
        const user = await userRepository.create(data);
        
        // Step B: Assign default 'customer' role
        const role = await roleRepository.getRoleByName('customer');
        if(role) {
            // sequelize magic method from 'belongsToMany'
            await user.addRole(role); 
        }
        
        return user;
    } catch(error) {
        console.log("SERVICE ERROR:", error); 
    if(error instanceof AppError) throw error;
    throw new AppError('Something went wrong in signup', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// --- 2. SIGNIN LOGIC ---
async function signin(data) {
    try {
        // Step A: Find User by Email
        const user = await userRepository.getUserByEmail(data.email);
        if(!user) {
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND);
        }

        // Step B: Verify Password (Bcrypt)
        const passwordMatch = checkPassword(data.password, user.password);
        if(!passwordMatch) {
            throw new AppError('Incorrect password', StatusCodes.BAD_REQUEST);
        }

        // Step C: Generate JWT Token
        const newJWT = createToken({ id: user.id, email: user.email });
        return newJWT;

    } catch(error) {
      console.log("SERVICE ERROR:", error);
    if(error instanceof AppError) throw error;
    throw new AppError('Something went wrong in signin', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// --- 3. VERIFICATION LOGIC ---
async function isAuthenticated(token) {
    try {
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        
        // Verify signature
        const response = verifyToken(token);
        
        // Verify user still exists
        const user = await userRepository.get(response.id);
        if(!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }
        
        return user.id;
    } catch(error) {
        console.log('SERVICE ERROR', error)
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    create,
    signin,
    isAuthenticated
}