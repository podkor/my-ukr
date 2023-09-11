// const db = require("../db");
// const bcrypt = require('bcryptjs');

const express = require("express");
const router = express.Router();
// const bodyParser = require('body-parser')

// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({extended: true}))

router.route("/").get((req, res, next) => {
    res.render('pages/profile', {
        username: req.session.username
    });
    // try {
    //     const isSignUpAction = false;
    //     const {username, password} = req.body
    //     const sql = `SELECT password
    //                  FROM user
    //                  where username = "${username}"`;
    //
    //     db.connection.query(sql, function (err, result) {
    //         if (err) {
    //             throw err;
    //         }
    //
    //         let user = Object.values(JSON.parse(JSON.stringify(result)));
    //         if (user.length > 0) {
    //             bcrypt.compare(password, user[0]['password'], (err, result) => {
    //                 if (result) {
    //                     req.session.username = username;
    //                     res.redirect('/app');
    //                 } else {
    //                     res.render('pages/login', {
    //                         message: "Login not successful! User not found.",
    //                         username: req.session.username,
    //                         isSignUpAction: isSignUpAction
    //                     });
    //                 }
    //             });
    //         } else {
    //             res.render('pages/login', {
    //                 message: "Login not successful! User not found.",
    //                 username: req.session.username,
    //                 isSignUpAction: isSignUpAction
    //             });
    //         }
    //     });
    // } catch (error) {
    //     res.status(400).json({
    //         message: "An error occurred",
    //         username: req.session.username,
    //         isSignUpAction: isSignUpAction
    //     })
    // }
});

// router.route("/signup").post(postSignUp);

module.exports = router;
