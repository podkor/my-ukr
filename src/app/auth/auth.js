const db = require("../db");
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const sql = `SELECT username FROM user where username = ${username} and password = ${password}`;

        db.connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            }

            let username = Object.values(JSON.parse(JSON.stringify(result)));
            if (!username) {
                res.status(401).json({
                    message: "Login not successful",
                    error: "User not found",
                })
            } else {
                res.status(200).json({
                    message: "Login successful",
                    username,
                })
            }
            //
            // res.render('pages/index', {
            //     categories: createCategoriesMenuDiv(category),
            //     dataTabs: dataTabs,
            //     log: log,
            // });
        });
        // const user = await User.findOne({ username, password })

    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        })
    }
}