const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { validationResult } = require('express-validator');

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'default-secret';

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id_number, name, password } = req.body;

    try {
        const [result] = await db.query('SELECT * FROM users WHERE id_number = ?', [id_number]);
        if (result.length > 0) {
            return res.status(400).json({ message: 'Identity Number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into the database
        const [insertResult] = await db.query(
            'INSERT INTO users ( id_number, name, password) VALUES (?, ?, ?)',
            [id_number, name, hashedPassword]
        );

        // Retrieve the newly created user
        const [newUserResult] = await db.query('SELECT * FROM users WHERE id = ?', [insertResult.insertId]);
        const newUser = newUserResult[0];

        // Generate JWT token
        const token = jwt.sign(
            {
                id: newUser.id,
                id_number: newUser.id_number,
                name: newUser.name,
                role: newUser.role,
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                id_number: newUser.id_number,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id_number, password } = req.body;

    try {
        const [result] = await db.query('SELECT * FROM users WHERE id_number = ?', [id_number]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                id_number: user.id_number,
                name: user.name,
                role: user.role,
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id_number: user.id_number,
                name: user.name,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = { register, login, logout };
