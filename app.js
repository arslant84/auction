const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Basic setup
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Simple car data
const car = {
    id: 1,
    name: "Tesla Model 3",
    image: "/images/tesla-model-3.jpg",
    description: "Electric sedan with autopilot",
    price: 35000,
    bids: []
};

// Show the page
app.get('/', (req, res) => {
    res.render('index', { car: car });
});

// Handle bids
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('placeBid', (data) => {
        if (data.amount > car.price) {
            car.price = data.amount;
            car.bids.push({
                bidder: data.bidder,
                amount: data.amount
            });
            
            // Tell everyone about the new bid
            io.emit('bidUpdate', {
                price: car.price,
                bidder: data.bidder
            });
        }
    });
});

// Start server with http instead of app
http.listen(3000, () => {
    console.log('Server running on port 3000');
}); 