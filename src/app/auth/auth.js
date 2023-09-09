const db = require("../db");
const bcrypt = require('bcryptjs');

exports.postLogin = async (req, res, next) => {
    try {
        const isSignUpAction = false;
        const {username, password} = req.body
        const sql = `SELECT password
                     FROM user
                     where username = "${username}"`;

        db.connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            }

            let user = Object.values(JSON.parse(JSON.stringify(result)));
            if (user.length > 0) {
                bcrypt.compare(password, user[0]['password'], (err, result) => {
                    if (result) {
                        req.session.username = username;
                        res.redirect('/app');
                    } else {
                        res.render('pages/login', {
                            message: "Login not successful! User not found.",
                            username: req.session.username,
                            isSignUpAction: isSignUpAction
                        });
                    }
                });
            } else {
                res.render('pages/login', {
                    message: "Login not successful! User not found.",
                    username: req.session.username,
                    isSignUpAction: isSignUpAction
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            username: req.session.username,
            isSignUpAction: isSignUpAction
        })
    }
}

exports.getLogin = (req, res) => {
    const isSignUpAction = false;
    res.render('pages/login', {
        message: "",
        username: req.session.username,
        isSignUpAction: isSignUpAction
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

exports.postSignUp = async (req, res, next) => {
    try {
        const isSignUpAction = true;
        const {username, email, password} = req.body

        if (!username || !email || !password) {
            let missedField;
            if (!username) {
                missedField = "Username";
            } else if (!email) {
                missedField = "Email";
            } else if (!password) {
                missedField = "Password";
            }
            res.render('pages/login', {
                message: `${missedField} is missed!`,
                username: req.session.username,
                isSignUpAction: isSignUpAction
            });
        } else {
            const sql = `SELECT username
                         FROM user
                         WHERE username = "${username}"`;

            db.connection.query(sql, function (err, result) {
                if (err) {
                    throw err;
                }

                let user = Object.values(JSON.parse(JSON.stringify(result)));
                if (user.length > 0) {
                    res.render('pages/login', {
                        message: "The user with the same name already exists!",
                        username: req.session.username,
                        isSignUpAction: isSignUpAction
                    });
                } else {
                    bcrypt.hash(password, 12, function (err, hash) {
                        let hashedPassword = hash;
                        let insertSql = `INSERT INTO user (username, password, email, role)
                                         VALUES ("${username}",
                                                 "${hashedPassword}",
                                                 "${email}", "USER")`;

                        db.connection.query(insertSql, function (err, result) {
                            if (err) {
                                throw err;
                            }
                            req.session.username = username;
                            res.redirect('/app');
                        });
                    });
                }
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            username: req.session.username,
            isSignUpAction: isSignUpAction
        })
    }
}
