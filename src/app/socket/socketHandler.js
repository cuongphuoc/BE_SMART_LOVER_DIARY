const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'cuong'; // Thay bằng key thật của bạn

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('checkCoupleStatus', async (token) => {
       console.log("token ",token);
      try {
        // Giải mã token
        
        const decoded = jwt.verify(token.token, JWT_SECRET);
       
        const userId = decoded.id; // Giả sử payload token có trường id
      //  console.log("id usser " + userId);
        const user = await User.findById(userId);
        if (!user) {
          return socket.emit('coupleStatus', { success: false, error: 'User not found' });
        }
        console.log(user.id_couple)

        const hasCouple = user.id_couple != null;
      //  console.log̣̣̣(hasCouple)
        socket.emit('coupleStatus', {
          success: true,
          hasCouple,
          id_couple: hasCouple ? user.id_couple : null,
          couplecode: hasCouple ? user.couplecode : null,
        });
      } catch (error) {
        socket.emit('coupleStatus', { success: false, error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

module.exports = socketHandler;
