var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save',function(next) {
    var user = this;
    if(this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
        if(err) {
            return next(err);
        }
        bcrypt.hash(user.password,salt,function(err,hash) {
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

// UserSchema.pre('update',function(next) {
//     var user = this;
//     if(this.isNew) {
//         this.meta.createAt = this.meta.updateAt = Date.now();
//     }else {
//         this.meta.updateAt = Date.now();
//     }
//     bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
//         if(err) {
//             return next(err);
//         }
//         bcrypt.hash(user.password,salt,function(err,hash) {
//             if(err) {
//                 return next(err);
//             }
//             user.password = hash;
//             next();
//         });
//     });
// });

UserSchema.methods = {
    comparePassword : function(password,cb) {
        // 使用bcrypt的compare方法对用户输入的密码和数据库中保存的密码进行比对
        console.log(this.password);
        bcrypt.compare(password,this.password,function(err,isMatch) {
            if(err) {
                return cb(err);
            }
            cb(null,isMatch);
        });
    }
};


var User = mongoose.model('User',UserSchema);
// var UserModel = mongoose.model(User);

exports.signup = function(req,res) {
    var _user = req.body;
    var _name = _user.name || '';
    User.findOne({name: _name}, function(err,user) {
        console.log(user);
        if(err) {
            console.log(err);
            return res.json({data: err});
        }
        if(user) {
            return res.json({data: '用户名已存在'});
        }else {
            userData = new User(_user);
            userData.save(function(err,user) {
                if(err) {
                    console.log(err);
                    return
                }
                console.log(user);
                return res.json({data: '注册成功'})
            })
        }
    })
    // console.log(user);
    // res.json({data:120120});
}

exports.signin = function (req,res) {
    var _user = req.body;
    var _name = _user.name || '';
    var _password = _user.password || '';
    User.findOne({name: _name}, function(err,user) {
        console.log(user);
        if(err) {
            console.log(err);
            return res.json({data: err});
        }
        if(!user) {
            return res.json({data: '用户不存在'});
        }else {
            user.comparePassword(_password,function (err,isMatch) {
                if(err) {
                    console.log(err);
                    return
                }

                if(isMatch) {
                    return res.status(200).json({data: '登录成功'});
                }else {
                    return res.json({data: '账户名与密码不匹配'});
                }
            })
        }
    })
}

exports.resetpwd = function(req, res) {
    var _user = req.body,
        _name = _user.name || '',
        _oldpassword = _user.oldpassword || '',
        _newpassword = _user.newpassword || '';
    User.findOne({name: _name},function (err,user) {
        console.log(user);
        if(err) {
            console.log(err);
            return res.json({data: err});
        }
        if(!user) {
            return res.json({data: '用户不存在'});
        }else {
            user.comparePassword(_oldpassword,function (err,isMatch) {
                if(err) {
                    console.log(err);
                    return res.json({data: err});
                }
                if(isMatch) {
                    // User.update({name:_name},{password: _newpassword},function (err) {
                    //     if(err) {
                    //         console.log(err);
                    //         return;
                    //     }else {
                    //         res.json({data:'update success'})
                    //     }
                    // })
                    user.password = _newpassword;
                    user.save(function (err) {
                        return res.status(200).json({data:'修改成功'})
                    })
                }
                if(!isMatch) {
                    res.json({data: '输入的旧密码有误'});
                }
            })
        }
    })
    // res.json({data: _user});
}

exports.deleteuser = function (req,res) {
    var _user = req.body,
        _name = _user.name || '';
    User.remove({name: _name},function (err,user) {
        if(err) {
            console.log(err);
            return
        }else {
            return res.json({data:'删除成功'});
        }
    })
}