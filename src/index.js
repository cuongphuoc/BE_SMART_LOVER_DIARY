const path = require('path');
const express = require('express');
const fs = require('fs');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
require('./config/util/dotenv');
const route = require('./routes');
const db = require('./config/Database/connectDatabase');

// Connect to DB
db.connect();

const app = express();

// Use static folder
app.use(express.static(path.join(__dirname, 'public')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

// HTTP logger
// app.use(morgan('combined'));

// Template engine
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

// Routes init
route(app);

app.listen(process.env.PORT, () =>
    console.log(`App listening at http://localhost:${process.env.PORT}`),
);
