const router = require('express').Router();
const passport = require('../auth/auth.js');
const User = require('../models/User.js');


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else res.redirect('/');
  // res.redirect('/profile');
} 

router.get('/',(req,res) => {
  if (req.isAuthenticated()) return res.redirect('/profile');
  else res.render('index', { user: req.user });
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile',
  {
    user : req.user
  });
});

router.get('/register',  (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/');
  else res.render('register');
});

//Local register
router.post('/register', (req, res) => {
  User.register(new User({ username : req.body.username }), req.body.password, (error, user) => {
    if (error) return res.render('register', { user, error: error.message });
    passport.authenticate('local')(req, res, ()=> {
      res.redirect('/');
    });
  });
});

router.post('/login', passport.authenticate('local',{
  successRedirect : '/profile',
  failureRedirect : '/fail'
}));

// router.post('/login', passport.authenticate('local'), (req, res) => {
//   res.redirect('/profile');
// });

//Google register
router.get('/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
  );

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/fail'
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.use(function(req, res, next) {
  if (!req.route)
      return next (new Error('404'));  
  next();
});



module.exports = router;