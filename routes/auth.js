const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require("express-validator")
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'xhjackmrphy*1';

router.post('/register', 
	[
		check('password', "Password must be longer than 3 and shorter than 12.").isLength({min:6, max:64})
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({message: "Uncorrect requests", errors})
			}
	
			const {username, password} = req.body
	
			const candidate = await User.findOne({username})
	
			if (candidate) {
				return res.status(400).json({message: `User with this username: ${username} already exist.`})
			}
			const hashPassword = await bcrypt.hash(password, 8)
			const user = new User({username, password: hashPassword})
			await user.save()
			return res.json({message: "User was created."})
	
		} catch(e) {
				console.error(e)
				res.send({message: "Server error"})
			
		}
	})
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({ token, userId: user._id });
    } else {
        res.status(401).send('Неверные учетные данные');
    }
});

module.exports = router;
