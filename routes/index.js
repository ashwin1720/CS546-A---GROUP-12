const mainRoutes = require('./main');

const loginRoutes = require('./login');
const signupRoutes = require('./signup');
const logoutRoutes = require('./logout');
const privateRoutes = require('./private');

const constructorMethod = (app) => {
  app.use('/', mainRoutes);
  app.use('/login', loginRoutes);
  app.use('/signup', signupRoutes);
  app.use('/logout', logoutRoutes);
  app.use('/private', privateRoutes);
  

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found !!!' });
  });
};

module.exports = constructorMethod;