const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const cors = require('cors');

const route = require('./routes');
const db = require('./config/db');

// Initialize Express app
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Connect to DB
db.connect();

// Use static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded data
app.use(
    express.urlencoded({
        extended: true,
    }),
);

// Middleware to parse JSON data
app.use(express.json());

// Use method-override middleware
app.use(methodOverride('_method'));

// Template engine setup (Handlebars)
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Initialize routes
route(app);

// Start the server
app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`),
);
