const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User.js');

passport.use(new GoogleStrategy({

  clientID        : process.env.CLIENT_ID,
  clientSecret    : process.env.CLIENT_SECRET,
  callbackURL     : process.env.GOOGLE_CALLBACK

},
async (token, refreshToken, profile, done) => {
    //  process.nextTick(() => {
         await User.findOne({ 'google.id' : profile.id },(err, user) => {
           console.log(user);
          if (err)
            return done(err);
          if (user) {
            console.log("here");
                return done(null, user);
          } else {
            console.log("here newUser");
            var newUser = new User();

            newUser.google.id    = profile.id;
            newUser.google.token = token;
            newUser.google.name  = profile.displayName;
            newUser.google.email = profile.emails[0].value; // pull the first email

            newUser.save((err) => {
              if (err) throw err;
              return done(null, newUser);
            });
          }
      });
  // });
}));

passport.use(User.createStrategy());

require('./init.js')(User, passport);

module.exports = passport;
