// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
//
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
//

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'passport'
});


module.exports = function(app) {
//
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render(path.join(__dirname, "../public/signup.ejs"));
  });
//
  app.get("/public/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.render(path.join(__dirname, "../public/login.ejs"));
  });
//
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be 
  //redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {

    var data = "";

    connection.query('SELECT * FROM members', function(err, rows) {
        if (err) {
            console.log(err);
        }
        var data = rows;

        // use index.ejs
        res.render(path.join(__dirname, "../public/members.ejs"), { data: data });
    });

  });
  // add page
  app.get('/add', function(req, res, next) {

      // use memberAdd.ejs
      res.render('../public/memberAdd.ejs', { title: 'Add Member'});
  });

  // add post
  app.post('/memberAdd', function(req, res, next) {

      var db = req.con;

      var sql = {
          Name: req.body.member_name,
          Gender: req.body.gender,
          Birthday: req.body.birthday
      };
      //console.log(sql);
      connection.query('INSERT INTO members SET ?', sql, function(err, rows) {
          if (err) {
              console.log(err);
          }
          res.setHeader('Content-Type', 'application/json');
          res.redirect('/members');
      });

  });

  app.get('/memberEdit', function(req, res, next) {

    var id = req.query.id;
    var db = req.con;
    var data = "";

    connection.query('SELECT * FROM members WHERE ID = ?', id, function(err, rows) {
        if (err) {
            console.log(err);
        }

        var data = rows;
        res.render('memberEdit.ejs', { data: data });
    });

  });

  app.post('/memberEdit', function(req, res, next) {

      var id = req.body.id;

      var sql = {
          Name: req.body.member_name,
          Gender: req.body.gender,
          Birthday: req.body.birthday
      };
      connection.query('UPDATE members SET ? WHERE ID = ?', [sql, id], function(err, rows) {
          if (err) {
              console.log(err);
          }

          res.setHeader('Content-Type', 'application/json');
          res.redirect('/members');
      });
  });
  app.get('/memberDelete', function(req, res, next) {

    var id = req.query.id;
    var db = req.con;

    connection.query('DELETE FROM members WHERE ID = ?', id, function(err, rows) {
        if (err) {
            console.log(err);
        }
        res.redirect('/members');
    });

  });




};
