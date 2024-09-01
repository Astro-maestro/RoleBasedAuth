const { hashPassword, comparePassword} = require('../helper/auth.helper');
const userModel = require('../model/user.model');
const jwt = require('jsonwebtoken');

class authController {
    async registerUser(req, res) {
        try {
            const { name, email, password } = req.body;

            const existMail = await userModel.findOne({email});
            if(existMail) {
                return res.status(400).json({message: 'Email already exists'});
            }
            const hashedPassword = await hashPassword(password);

            const user = new userModel({
                name,
                email,
                password: hashedPassword,
            });

            user.save();
            res.status(201).json(
                {
                    message: 'User registered successfully',
                    data: user
                });
        } catch (error) {
            
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
    
            if (!email || !password) {
                return res.status(400).json({ message: 'Invalid email and password' });
            }
    
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Email is not registered' });
            }
    
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }
    
            const token = await jwt.sign(
                {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin  
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            
            let responseMessage = 'User logged in successfully';
            if (user.isAdmin === 'ADMIN') {
                responseMessage = 'Admin logged in successfully';
            }
    
            res.json({
                message: responseMessage,
                token: token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin  
                }
            });
        } catch (error) {
            console.log("error: ", error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    

    async dashboard(req, res) {
        try {
            const { isAdmin, name } = req.user;  
    
            console.log("Logged user data: ", req.user);
    
            if (isAdmin === 'ADMIN') {
                return res.status(200).json({
                    message: `Welcome to the admin dashboard, ${name}`
                });
            } else if (isAdmin === 'USER') {
                return res.status(200).json({
                    message: `Welcome to the user dashboard, ${name}`
                });
            } else {
                return res.status(403).json({ message: 'Access denied' });  
            }
        } catch (error) {
            console.log("error: ", error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    

    async logoutUser(req, res) {
        try {
            const { isAdmin, name } = req.user; 
    
            let message = 'User logged out successfully';
    
            if (isAdmin === 'ADMIN') {
                message = `Admin ${name} logged out successfully`;
            } else if (isAdmin === 'USER') {
                message = `User ${name} logged out successfully`;
            }
    
            res.status(200).json({ message: message });
        } catch (error) {
            res.status(500).json({ message: 'Error during logout', error: error.message });
        }
    }
    

    
}

module.exports = new authController();