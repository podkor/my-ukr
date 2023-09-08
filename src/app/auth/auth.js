const db = require("../db");
const bcrypt = require('bcrypt');

exports.postLogin = async (req, res, next) => {
    try {
        const {username, password} = req.body
        const sql = `SELECT password
                     FROM user
                     where username = "${username}"`;

        db.connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            // bcrypt.hash(password, 12, function (err, hash) {
            //     let p = hash;
            // });

            let user = Object.values(JSON.parse(JSON.stringify(result)));
            if (user.length > 0) {
                bcrypt.compare(password, user[0]['password'], (err, result) => {
                    if (result) {
                        req.session.username = username;
                        res.redirect('/app');
                    } else {
                        res.render('pages/login', {
                            message: "Login not successful!",
                            error: "User not found",
                            username: req.session.username
                        });
                    }
                });
            } else {
                res.render('pages/login', {
                    message: "Login not successful!",
                    error: "User not found",
                    username: req.session.username
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
            username: req.session.username
        })
    }
}

exports.getLogin = (req, res) => {
    res.render('pages/login', {
        error: "",
        message: "",
        username: req.session.username
    });
};

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/app');
        }
    });
};
