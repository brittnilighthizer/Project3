var express = require("express");
var db = require("../../models");
var passport = require("../../config/passport");
var router = express.Router();

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/api/login", passport.authenticate("local"), function (req, res) {
  console.log("got to login")
  res.json(req.user);
});

// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/api/signup", function (req, res) {
  db.User.create({
    email: req.body.email,
    password: req.body.password
  })
    .then(function (req) {
      res.redirect(307, "/api/login");
    })
    .catch(function (err) {
      res.status(401).json(err);
    });
});

// Route for logging user out
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});


// Route for getting some data about our user to be used client side
router.get("/api/user_data", function (req, res) {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      id: req.user.id,
      email: req.user.email,
      userName: req.user.userName,
      header: req.user.header,
      dedication: req.user.dedication,
      isMaster: req.user.isMaster,
      campaign: req.user.campaign,
      experience: req.user.experience,
      profilePic: req.user.profilePic,
    });
  }
});
// if you need to add a table, just add another case, and switch the db.___.findAll to the name of your table.
router.get("/:table", function (req, res) {
  switch (req.params.table) {
    case "matches":
      db.Matches.findAll().then(function (dbMatches) {
        res.send(dbMatches);
      });
      break;
    case "user":
      db.User.findAll().then(function (dbUser) {
        res.send(dbUser);
      });
      break;
  }
});

router.get("/api/user/:id", function (req, res) {

  db.User.findOne({ where: { id: req.params.id } }).then(function (dbUser) {
    console.log(dbUser)
    res.json({
      id: req.user.id,
      email: req.user.email,
      userName: req.user.userName,
      header: req.user.header,
      dedication: req.user.dedication,
      isMaster: req.user.isMaster,
      campaign: req.user.campaign,
      experience: req.user.experience,
      profilePic: req.user.profilePic,
    });
  })
});

router.get("/api/users", function (req, res) {
  db.User.findAll({}).then(function (dbUsers) {
    console.log(dbUsers)
    res.json({ dbUsers });
  })
});

router.post("/:table", function (req, res) {
  switch (req.params.table) {
    case "user":
      db.User.create({
        user: req.body.user
      }).then(function (dbUser) {
        res.json(dbUser);
      });
      break;
    case "matches":
      db.Match.create({
        user1: req.body.user1,
        likedUser: req.body.likedUser
      }).then(function (dbMatches) {
        res.json(dbMatches);
      });
      break;

    default:
      break;
  }

});

router.put("/api/update_user", function (req, res) {
  console.log(req.user)
  db.User.update(
    {
      userName: req.body.userName,
      header: req.body.header,
      dedication: req.body.dedication,
      isMaster: req.body.isMaster,
      campaign: req.body.campaign,
      experience: req.body.experience,
      profilePic: req.body.profilePic,
    },
    {
      where: { id: req.user.id }
    }
  )
    .then(res => {

      console.log("succesful update!", res)
    });
})

module.exports = router;
