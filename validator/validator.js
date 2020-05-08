const { check, validationResult } = require('express-validator');

const userValidationRules= () => {
	return [
		check('title').isLength({min:1}).withMessage('Title is a required field'),
		check('body').isLength({min:1}).withMessage('Body is a required field')
	]
}

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if(errors.isEmpty()) {
		return next(); //res를 사용해서 결과를 내지 않고 next를 사용해서 판단을 유보시킨다.
	} else {
	/*
	const extractedErrors = [];
	errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));
	*/
	return res.render('add_article', {
		title: 'Add Article',
		errors: errors.array()
	});
		
	}
}

module.exports = {
	userValidationRules,
	validate,
}