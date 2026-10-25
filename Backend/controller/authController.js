const jwt = require('jsonwebtoken');
const User = require('../models/User');

//helper: generate jwt
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc      Register new user
// @route     Post/api/auth/register
// @access    public

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all field" });
        }

        // check if user is exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User is already exists" });
        }

        //create user
        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                message: "User registered successfully",
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc      login user
// @route     Post/api/auth/login
// @access    public

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+passwor");

        if (user && (await user.matchPassword(password))) {
            res.json({
                message: "Login successful",
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc      get current logged-in user
// @route     Post/api/auth/profile
// @access    public

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isPro: user.isPro,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// @desc      get current logged-in user
// @route     Post/api/auth/profile
// @access    public

exports.updateUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);

        if(user){
            user.name = req.body.name || user.name;

            const updateUser = await user.save();

            res.json({
                _id: updateUser._id,
                name:updateUser.name,
            });
        }else{
            res.status(404).json({ message: "User not found"});
        }
    }catch{
        res.status(500).json({message: "Server error"});
    }
};
