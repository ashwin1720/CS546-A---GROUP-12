const landingRoutes =require('./landingRoutes')

const authorLoginRoutes =require('./author_login')
const authorSignupRoutes = require('./author_signup')
const customerLoginRoutes = require('./customer_login')
const customerSignupRoutes = require('./customer_signup')
const authorIndexRoutes = require('./author_index')
const authorUploadRoutes = require('./author_upload')
const authorLogoutRoutes = require('./author_logout')
const customerIndexRoutes = require('./customer_index')




const constructorMethod = (app) => {
  app.use('/', landingRoutes)
  app.use('/author_login', authorLoginRoutes);
  app.use('/author_signup', authorSignupRoutes);
  app.use('/customer_login',customerLoginRoutes)
  app.use('/customer_signup',customerSignupRoutes)
  app.use('/author_index',authorIndexRoutes)
  app.use('/author_index/author_update_personal_details',authorIndexRoutes)
  app.use('/author_upload', authorUploadRoutes)
  app.use('/author_index/author_upload', authorUploadRoutes)
  app.use('/author_logout', authorLogoutRoutes)


  app.use('/customer_index', customerIndexRoutes)

  
  
  
  

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found !!!' });
  });
};

module.exports = constructorMethod;