const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/user');

const scryptAsync = promisify(crypto.scrypt);


async function hashpassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');

    const derivedKey = await scryptAsync(password, salt, 64);

    return `${salt}:${derivedKey.toString('hex')}`;
}

async function createUser(req,res, next) {
    try {
        const payload = req.validatedBody || req.body;

    
        if (!payload.username) {
            return res.status(400).json({ error: 'Username is required' });
        }
    
        if (!payload.password) {
            return res.status(400).json({ error: 'password is required' });
        }
    
        if (!payload.email) {
            return res.status(400).json({ error: 'email is required' });
        }
        
        const checkIfEmailExists = await User.exists({ email: payload.email });

        if (checkIfEmailExists) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const checkIfUsernameExists = await User.exists({ username: payload.username });
        
        if (checkIfUsernameExists) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hashedPassword = await hashpassword(payload.password);
        
        const user = new User({
            username: payload.username,
            email: payload.email,
            password: hashedPassword

        });
    
        const saved = await user.save();

        const savedObject = saved.toObject();

        delete savedObject.password;
    
        return res.status(201).json({ data: savedObject });
    } catch (err) {
        next(err);
    }
}

module.exports = { createUser }