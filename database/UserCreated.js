const User = require('../models/user');

const startServer = async () => {
  try {
      const usersData = [
        //creation
        { fullname: 'Reymond Godoy', email: 'member@gmail.com', contact: '1234567890', role:'member', assign: 'Mayor', password: 'password123'},
        { fullname: 'Marz Velasco', email: 'admin@gmail.com', contact: '1234567890', role:'admin', assign: 'Mayor', password: 'password123'},
        { fullname: 'Supply Supply', email: 'supply@gmail.com', contact: '1234567890', role:'supply', assign: 'Mayor', password: 'password123'},
        { fullname: 'Supply Supply', email: 'supreme@gmail.com', contact: '1234567890', role:'superAdmin', assign: 'Mayor', password: 'password123'}
      ];

      const createdUsers = [];
      for (const userData of usersData) {
        const existingUser = await User.findOne({ email: userData.email });

        if (!existingUser) {
            const newUser = new User(userData);
            const savedUser = await newUser.save();
            console.log('data created');
            createdUsers.push(savedUser);
        } else {
            console.log(`User with email ${userData.email} already exists.`);
        }
    }

  } catch (error) {
      console.error('Error starting server:', error);
  }
}

module.exports =  startServer ;