const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  // [GET] /api/users
  async getData(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] /api/users
  async add(req, res) {
    try {
      const user = new User(req.body);
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [PUT] /api/users/:id
  async edit(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [DELETE] /api/users/:id
  async delete(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [POST] /api/users/register
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      const savedUser = await newUser.save();

      res.status(201).json({ message: 'User registered successfully', user: savedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [POST] /api/users/login
  async login(req, res) {
    try {
     const { email, password } = req.body;
     if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
     }
  
     const user = await User.findOne({ email }).select('+password');
     if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
     }
  
     const payload = { id: user._id, role: user.role };
     if (user.id_couple) {
      payload.id_couple = user.id_couple;
     }
  
     const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'cuong',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
     );
  
     const cookieOptions = {
      expires: new Date(Date.now() + ((process.env.JWT_COOKIE_EXPIRE || 1) * 24 * 60 * 60 * 1000)),
      httpOnly: true,
      sameSite: 'Strict',
     };
  
     if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true;
     }
  
     res.cookie('authToken', token, cookieOptions);
  
     req.session.userId = user._id;
     req.session.role = user.role;
     req.session.loggedIn = true;
     if (user.id_couple) {
      req.session.id_couple = user.id_couple;
     }
  
     const responseData = { message: 'Login successful', token ,id_couple: user.id_couple,couplecode:user.couplecode};
     if (user.id_couple) {
      responseData.id_couple = user.id_couple;
     }
  
     res.status(200).json(responseData);
    } catch (error) {
     res.status(500).json({ error: error.message });
    }
   }
}

module.exports = new UserController();
