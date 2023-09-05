const express = require("express");
const router = express.Router();
const {login} = require("./auth");

router.route("/login").post(login);
router.route("/login").get((req, res) => {
    res.render('pages/login', {});
});

module.exports = router;