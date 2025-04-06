const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const rootResolvers = {
  Query: {
    hello: () => "Hello from GraphQL 👋",
    getEmployees: async () => await Employee.find(),
    getEmployee: async (_, { id }) => await Employee.findById(id),
    searchEmployees: async (_, filters) => await Employee.find(filters),
    getCurrentUser: async (_, __, { user }) => user ? await User.findById(user.userId) : null
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) throw new Error('User already registered');

      const hashed = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashed });
      return await newUser.save();
    },

    login: async (_, { username, password }) => {
      const foundUser = await User.findOne({ username });
      if (!foundUser) throw new Error('Account not found');

      const match = await bcrypt.compare(password, foundUser.password);
      if (!match) throw new Error('Incorrect password');

      const accessToken = jwt.sign(
        { userId: foundUser.id, username: foundUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { token: accessToken, user: foundUser };
    },

    addEmployee: async (_, payload) => {
      const newEmp = new Employee(payload);
      return await newEmp.save();
    },

    updateEmployee: async (_, { id, ...updates }) => {
      return await Employee.findByIdAndUpdate(id, updates, { new: true });
    },

    deleteEmployee: async (_, { id }) => {
      return await Employee.findByIdAndDelete(id);
    }
  }
};

module.exports = rootResolvers;
