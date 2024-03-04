const mongoose  = require("mongoose");

const dbConnect = async () => {
    try{
        // const conn =  mongoose.connect(process.env.MONGODB_CONNECT_URI);
        const conn = mongoose.connect('mongodb://127.0.0.1/projectdb')
        console.log('database connected');
        return conn;
    } catch (error){
        console.log('database error', error);
    }
};
module.exports = dbConnect;