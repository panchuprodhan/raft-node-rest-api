
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const routes = require('./routes/routes');
const users = require('./routes/users');
const jwt = require('jsonwebtoken')
const {Server} = require('socket.io')


mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();
app.set('secretKey', 'nodeRestApi');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// public route
app.use('/users', users)

// private route
app.use('/api', validateUser, routes);

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
        if (err) {
            res.json({status:"error", message: err.message, data:null});
        }else{
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}

app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    console.log(err);
 
    if(err.status === 404)
    res.status(404).json({message: "Not found"});
    else 
    res.status(500).json({message: err.message});
});

const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server Started at ${process.env.PORT}`)
})

const socketIo = new Server(server, {
    cors: {
        origin: '*',
    },
});

socketIo.on('connection', (socket) => {
    console.log('New connection created');

    const token = socket.handshake.auth.token;
    console.log('Auth Token', token);

    try {
        // Verify the token here and get user info from JWT token.
    } catch(error) {
        socket.disconnect(true);
    }

    // A client is disconnected.
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // Read message recieved from client.
    socket.on('message_from_client', (data) => {
        console.log('message_from_client: ', data);
    });

    // Send a message to the connected client 5 seconds after the connection is created.
    setTimeout(() => {
        socket.emit('message_from_server', `Message: ${Math.random()}`);
    }, 5_000);

    // Get the room number from the client.
    const roomNumber = toString(socket.handshake.query.roomNumber);
    // Join room for specific users.
    const room = `room-userId-${roomNumber}`;
    socket.join(room);

    // Emit to room by room number.
    setTimeout(() => {
        socketIo.to(room).emit('room-userId', `You are in room number: ${roomNumber}`);
    }, 2_000);
});
