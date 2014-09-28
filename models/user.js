var mongoose = require('mongoose');

// user schema ========================
var userSchema = mongoose.Schema({
    user: {
        type: String
    },
    password: {
        type: String,
        // set: emptyPw, // adding a setter for this
        default: ''
    },
    count: {
        type: Number,
        min: 0,
        required: true
    }
});


// codes static variables ========================
userSchema.statics.MAX_PASSWORD_LENGTH = 128;
userSchema.statics.MAX_USERNAME_LENGTH = 128;
userSchema.statics.UNKNOWNFAILURE = -100;

userSchema.statics.SUCCESSFUL = {
    num: 1
};

userSchema.statics.ERR_BAD_CREDENTIALS = {
    num: -1,
    str: "Invalid username and password combination. Please try again."
};
userSchema.statics.ERR_BAD_USERNAME = {
    num: -3,
    str: "The user name should be non-empty and at most 128 characters long. Please try again."
};
userSchema.statics.ERR_BAD_PASSWORD = {
    num: -4,
    str: "The password should be at most 128 characters long. Please try again."
};
userSchema.statics.ERR_USER_EXISTS = {
    num: -2,
    str: "This username already exists. Please try again."
};

// static_methods ========================
userSchema.statics.add = function(username, password, cb) {
    // console.log('IN ADD STATIC METHOD');
    User.findOne({
        'user': username
    }, function(err, user) {
        if (user) {
            // console.log('User already exists with username: ' + user.user);
            cb(User.ERR_USER_EXISTS.num);
        } else {
            var newUser = new User();
            newUser.user = username;
            newUser.password = password;
            newUser.count = 1;
            newUser.save(function(err) {
                if (err) {
                    // console.log(err.errors);
                    if (err.errors.user) {
                        cb(User.ERR_BAD_USERNAME.num);
                    } else if (err.errors.password) {
                        cb(User.ERR_BAD_PASSWORD.num);
                    } else {
                        cb(User.UNKNOWNFAILURE);
                    }
                } else {
                    // console.log('user successfully added');
                    cb(newUser.count);
                }
            });
        }
    });
};

userSchema.statics.login = function(username, password, cb) {
    User.findOne({
        'user': username,
        'password': password
    }, function(err, user) {
        if (err) {
            // console.log(err);
            cb(User.UNKNOWNFAILURE);
        } else if (user) {
            // console.log(user.count);
            user.updateLogInCount();
            // console.log(user.count);
            cb(user.count);
        } else if (!user) {
            cb(User.ERR_BAD_CREDENTIALS.num);
        } else {
            // console.log('something is really wrong');
            cb(User.UNKNOWNFAILURE);
        }
    });
}

// instance methods ======================
userSchema.methods.updateLogInCount = function() {
    this.count += 1;
    this.save();
    return true;
};

var User = mongoose.model('User', userSchema);

// validations ======================

// User Validation
User.schema.path('user').validate(function(value) {
    if (!value) {
        // console.log('user validation function: value is null??');
        return false;
    }
    return value.length <= User.MAX_USERNAME_LENGTH && value.length > 0;
}, User.ERR_BAD_USERNAME.str);

// Password Validation
User.schema.path('password').validate(function(value) {
    if (!value) {
        // password can be empty
        return true;
    }
    return value.length <= User.MAX_PASSWORD_LENGTH;
}, User.ERR_BAD_PASSWORD.str);

module.exports = User