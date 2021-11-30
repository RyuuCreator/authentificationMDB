const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
	// USERNAMES
	User.findOne({
		username: req.body.username,
	}).exec((err, user) => {
		if (err) {
			res.status(500).send({ 
                message: err 
            });
			return;
		}

		if (user) {
			res.status(400).send({ 
                message: "Échec ! L'username est déjà utilisé" 
            });
			return;
		}

		// EMAIL
		User.findOne({
			email: req.body.email,
		}).exec((err, user) => {
			if (err) {
				res.stats(500).send({ 
                    message: err 
                });
				return;
			}

			if (user) {
				res.status(400).send({ 
                    message: "Échec ! L'email est déjà utilisé" 
                });
				return;
			}

			next();
		});
	});
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if(!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({ 
                    message: "Échec ! Le role : ${req.body.roles[i]} n'existe pas"
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;