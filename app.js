const express = require('express');

const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');
const upload = require('express-fileupload')


app.use(upload())
app.use(express.json());
app.use('/public', static);
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
console.log("Success")
app.set('view engine', 'handlebars');



app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 60000000 }
  })
);





app.use('/customer_index', (req, res, next) => {
  if (!req.session.user) {
    res.statusCode =403;
    return res.redirect('/customer_login')
  } else {
    next();
  }
});


app.use('/author_index', (req, res, next) => {
  
  if (!req.session.user) {
    return res.redirect('/author_login');
  } 
   else{
    next();
  }
});



app.use('/author_signup',(req,res,next) =>{
  if(req.session.user){
    return res.redirect('/author_index')
  }else{
    next()
  }
})


//app.use(upload());
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});