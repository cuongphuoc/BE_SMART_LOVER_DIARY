const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const cors = require('cors');
const ngrok = require('ngrok');
const route = require('./routes');
const db = require('./config/db');
const { setPublicUrl, getPublicUrl } = require('./util/Url');
const session = require('express-session');
const { Server } = require('socket.io');
const http = require('http'); // THÊM dòng này
const socketHandler = require('./app/socket/socketHandler');

const app = express();
const port = 3000;

// Tạo server HTTP từ Express app
const server = http.createServer(app);

// Tạo socket.io server dựa trên HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',  // Tuỳ chỉnh nếu cần
    methods: ['GET', 'POST']
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());

app.use(session({
  secret: 'cuong',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Kết nối DB
db.connect();

// Khởi tạo socket handler với io
socketHandler(io);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b,
  },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes
route(app);

// Chạy server qua biến server (HTTP)
server.listen(port, '0.0.0.0', async () => {
  console.log(`Server is running at http://192.168.x.x:${port}`);

 try {
    const url = await ngrok.connect(port);
    setPublicUrl(url);
    console.log(`Public URL: ${url}`);
    console.log(`Public URL1: ${getPublicUrl()}`);
  } catch (error) {
    console.error('Error starting ngrok tunnel:', error);
  }
});
