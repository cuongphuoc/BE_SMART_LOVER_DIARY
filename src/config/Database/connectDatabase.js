const mongoose = require('mongoose');
require('../../util/dotenv');
async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        await mongoose.connection.collection('users').dropIndex('couplecode_1');

        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect failure!!!');
    }
}

module.exports = { connect };
