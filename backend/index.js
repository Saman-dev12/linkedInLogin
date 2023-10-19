const express = require("express");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/UserModel");
require("dotenv").config();
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const app = express();
const connectDB = require("./db");

connectDB();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/linkedin/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Search for the user in the database by their LinkedIn ID
      User.findOne({ linkedinId: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          // If the user doesn't exist, create a new user
          user = new User({
            linkedinId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            // Add other fields as needed
          });
          user.save((err) => {
            if (err) {
              return done(err);
            }
            return done(null, user);
          });
        } else {
          // If the user exists, return the user
          return done(null, user);
        }
      });
    }
  )
);

// Define the route for initiating LinkedIn OAuth
app.get("/auth/linkedin", passport.authenticate("linkedin"));

// Define the route for handling the LinkedIn OAuth callback
app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/home", // Redirect to a success page or your application's home page
    failureRedirect: "/", // Redirect to a failure page if authentication fails
  })
);

// Define a route to handle user logout
app.get("/logout", (req, res) => {
  req.logout(); // This logs the user out and clears the session
  res.redirect("/"); // Redirect the user to the homepage or another appropriate page
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
