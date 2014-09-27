// a router is a mini app. Just for middleware and routes
var express = require('express');
var router = express.Router();
var User = require('../models/user')

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
	console.log('in printing middleware: %s', req.body);
    // console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
	res.json({
		message: 'Bear created!'
	});
});

router.post('/users/add', function(req, res) {
	console.log('in post request of /users/add');
	console.log("user: " + req.body.user);
	console.log("password: " + req.body.password);

	User.findOne({
		'user': req.body.user
	}, function(err, user) {
		if (user) {
			console.log(user);
			console.log('User already exists with username: ' + user.user);
			res.json({
				errCode: User.ERR_USER_EXISTS.num
			});
		} else {
			var newUser = new User();
			newUser.user = req.body.user;
			newUser.password = req.body.password;
			newUser.count = 1;
			newUser.save(function(err) {
				if (err) {
					console.log(err.errors);
					if (err.errors.user) {
						res.json({
							errCode: User.ERR_BAD_USERNAME.num,
						});
					} else if (err.errors.password) {
						res.json({
							errCode: User.ERR_BAD_PASSWORD.num,
						});
					} else {
                        // return 500 error if something else is wrong
                        res.status(500);
                    }
                } else {
                	console.log('user successfully added');
                	res.json({
                		errCode: User.SUCCESSFUL.num,
                		count: newUser.count
                	});
                }
            });
		}
	});
});


router.post('/users/login', function(req, res) {
	console.log('in post request of /users/add');
	console.log("user: " + req.body.user);
	console.log("password: " + req.body.password);

	User.findOne({
		'user': req.body.user,
		'password': req.body.password
	}, function(err, user) {
		if (err) {
			console.log(err);
			res.status(500);
		} else if (user) {
			console.log(user.count);
			user.updateLogInCount();
			console.log(user.count);
			res.json({
				errcode: User.SUCCESSFUL.num,
				password: user.password,
				user: user.user,
				count: user.count
			});
		} else if (!user) {
			res.json({
				errCode: User.ERR_BAD_CREDENTIALS.num
			});
		} else {
			res.status(500);
			console.log('something is really wrong');
		}
	});
});

module.exports = router;