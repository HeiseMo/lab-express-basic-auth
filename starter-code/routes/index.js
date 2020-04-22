const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

//Middleware

const checkLogin = () =>{
  return (req, res, next) => {
    if(req.session.user) {
      console.log('User is logged in')
    } else {
      res.redirect('login');
    }
  };
};

//Signup Stuff

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
const { username, password } = req.body;
if (password.length < 8) {
  res.render('signup', { message: 'Your password must be 8 characters minimum' });
  return;
}
if (username === '') {
  res.render('signup', { message: 'Your username cannot be empty' });
  return;
}

User.findOne({ username: username }).then(found => {
  if (found !== null) {
    res.render('signup', { message: 'Username already exists!' });
  } else {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    User.create({ username: username, password: hash })
      .then(userDB => {
        res.redirect('/login');
      })
      .catch(err => {
        next(err);
      });
  }
})
});

//Login Stuff

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username }).then(found => {
    if (found === null) {
      res.render('login', { message: 'Wrong credentials!' });
      return;
    }
    if(bcrypt.compareSync(password, found.password)) {
        req.session.user = found;
        res.redirect('/profile');
        } else {
          res.render('login', { message: 'Wrong credentials!' });
        }
  });
});

//Profile Stuff

router.get('/profile', checkLogin(), (req, res, next) => {
  res.render('profile');
});

module.exports = router;
