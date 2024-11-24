const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

const port = 3000;

//MIDDLEWARE
const path = require('path');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET
const users = [
    {
        'id': 1,
        'name': 'richie',
        'key': '18222071',
    },
];
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});


app.post('/login', (req, res) =>{
    const { name, key } = req.body;

    const user = users.find(u => u.name === name && u.key === key);
    if (!user){
        return res.status(401).json({message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({id: user.id, name: user.name}, JWT_SECRET, {expiresIn: '1h'});
    res.json({message: 'Login successful', token});
});

app.get('/hello', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({message: 'Authorization header missing'});
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) =>{
        if (err){
            return res.status(403).json({message: 'Invalid or expired token'});
        }
        res.json({message: 'hello world'});
    });
});