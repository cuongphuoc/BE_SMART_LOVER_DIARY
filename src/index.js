const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const cors = require('cors');
const ngrok = require('ngrok');
const route = require('./routes');
const db = require('./config/db');
const { setPublicUrl,getPublicUrl } = require('./util/Url');
const session = require('express-session');
// Initialize Express app
const app = express();
const port = 3000;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Use CORS middleware
app.use(cors());
app.use(session({
    secret: 'cuong', // Mã hóa session với một key
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: true, // Lưu session ngay cả khi nó chưa được thay đổi
    cookie: { secure: false } // Chỉ sử dụng khi không chạy trên HTTPS
  }));
  
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
app.listen(3000, '0.0.0.0', async () => {
    console.log('Server is running at http://192.168.x.x:3000');
    
  /* try {
        const url = await ngrok.connect(port);
        setPublicUrl(url);
        console.log(`Public URL: ${url} `);
        console.log(`Public URL1: ${getPublicUrl()} `);

    } catch (error) {
        console.error('Error starting ngrok tunnel:', error);
    }*/
});
