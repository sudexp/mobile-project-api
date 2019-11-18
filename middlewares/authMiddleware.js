const User = require('../models/User');

// Add 'middlware' to check auth token. Request { Headers: {'token': '123456789'}}
// 1. Looks for the auth token in headers
// 2. Finds a user with this token
//   2a If token is found and valid then OK
//   2b If token is not found or expired, then reject right away {error: 'invalid token'}
// 3. Adds user information to the request: {params: {userId: 'user-id-here'}} and calls next().

// validate token
const validateToken = (token, res, req, next) => {
  User.find(token).then(data => {
    console.log(`token = ${token}, data = ${data}`);
    // check if data is not empty
    // grab userID
    if (!data.length) {
      console.log(`[authMiddleware] Error: invalid token`);
      res.json({ error: 'invalid token' });
      return;
    }
    const userId = data[0]._id;
    req.userId = userId;
    console.log(`[authMiddleware] Token is OK. User id = ${userId}`);
    next();
  }).catch(() => {
    res.json({ error: 'system error' });
  });
}

const authMiddleware = (req, res, next) => {
  console.log(`[authMiddleware] ...`);
  // todo: it is better to use headers for storing token instead of query param.
  const token = req.query.token;
  const allowWithoutToken =
    req.path === '/users' ||
    req.path === '/auth' ||
    req.path.search('collection') !== -1;
  if (allowWithoutToken) {
    console.log(`[authMiddleware] allowWithoutToken for ${req.path}`);
    next();
    return;
  }

  if (!token) {
    console.log(`[authMiddleware] Error: Token is required.`);
    res.json({ error: 'Token is required!' });
    return;
  }

  validateToken(token, res, req, next);
};

module.exports = authMiddleware;
