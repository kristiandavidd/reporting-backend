const express = require('express');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const fs = require('fs');

// Pastikan folder 'uploads' ada, jika tidak buat foldernya
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Folder uploads telah dibuat.');
}


const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(cors({
    origin: [
        'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Token'],
}));
app.use(express.json());
app.options('*', cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    console.error('JWT_SECRET is not set');
    process.exit(1);
}

const authRouter = require('./routes/auth');
const reportRoutes = require('./routes/report');
const trackingRoutes = require('./routes/tracking');
const verificationRoutes = require('./routes/verification');

app.use('/verification', verificationRoutes);
app.use('/report', reportRoutes);
app.use('/auth', authRouter);
app.use('/tracking', trackingRoutes);

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

