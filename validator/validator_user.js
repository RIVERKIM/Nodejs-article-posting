const {check, validationResult} = require('express-validator');

const userValidationRules = () => {
	return [
	check('name').exists().withMessage("Name is required").isAlphanumeric().withMessage("Name must be alphanumeric"),
	check('email').exists().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
	check('username').exists().withMessage("Username is required"),
	check('password').exists().withMessage("Password is required").isAlphanumeric().withMessage("Password must be alphanumeric"),
	check('passwordConfirmation').exists().custom((value, {req}) => value === req.body.password).withMessage("Password must be matched!!"),
	]
}

const validate = (req, res, next) => {
	const errors = validationResult(req);
	
	if(errors.isEmpty()) {
		return next();
	} else {
		return res.render('register', {
			errors: errors.array(),
		});
	}
}

module.exports = {
	userValidationRules,
	validate,
}