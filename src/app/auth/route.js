const express = require("express");
const router = express.Router();
const {getLogin, postLogin, getLogout} = require("./auth");
const bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.route("/login").get(getLogin).post(postLogin);

router.route("/logout").get(getLogout);

module.exports = router;
