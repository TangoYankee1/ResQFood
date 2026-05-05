const config = {
  db: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'resqfood_db'
  },
  jwtSecret: 'your_jwt_secret' // TODO: Move to environment variable for production
};

module.exports = config;