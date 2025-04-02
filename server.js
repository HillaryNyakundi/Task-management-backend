require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // ✅ Import connect-pg-simple
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { sequelize } = require('./models');
const { User } = require('./models');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolver');
const { Pool } = require('pg');

const app = express();

// ✅ PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in your .env file
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ✅ Session Middleware (Using PostgreSQL Store)
app.use(
  session({
    store: new pgSession({
      pool, // ✅ Use the PostgreSQL connection pool
      tableName: 'session', // The table will be created automatically
      createTableIfMissing: true, // Create the table if it doesn't exist
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ CORS (Allows frontend to send cookies with requests)
app.use(
  cors({
    origin: 'http://localhost:3000', // Ensure this matches your frontend origin
    credentials: true, // Required for cookies
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// --- ✅ Authentication Routes ---
/**
 * Express.js API Routes
 * @module server
 */
/**
 * Registers a new user.
 * @route POST /auth/signup
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Object} Response message and user data.
 */
app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    req.session.userId = newUser.id;
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * Logs in a user.
 * @route POST /auth/login
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Object} Response message and user data.
 */
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * Logs out the current user.
 * @route POST /auth/logout
 * @returns {Object} Response message.
 */
app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

app.get('/auth/me', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: 'Not authenticated' });

  const user = await User.findByPk(req.session.userId, {
    attributes: { exclude: ['password'] },
  });

  res.json(user);
});

// ✅ Database Connection
sequelize
  .authenticate()
  .then(() => console.log('✅ Database connected successfully!'))
  .catch((err) => console.error('❌ Database connection failed:', err));

// ✅ Apollo Server Setup
async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ req, userId: req.session?.userId }),
    })
  );

  const PORT = process.env.PORT || 5000;
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}/graphql`)
    );
  }
}

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

startServer();
module.exports = app;
