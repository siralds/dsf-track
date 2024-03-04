const SITE_TITLE = 'TESDA';
const User = require('../models/user');
const formRequest = require('../models/request');
const bcrypt = require('bcrypt')


module.exports.edit = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        if (user) {
            res.render('profile', {
                site_title: SITE_TITLE,
                title: 'Edit',
                currentUrl: req.originalUrl,
                user: user,
            });
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('error:', error);
        return res.status(500).render('500', {
            user: user,
        })
    }
}

module.exports.doEdit = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        if (user) {
            const email = req.body.email
            if (user.email === email) {
                const password = req.body.password;
                const confirmPassword = req.body.confirmPassword;
                if (password) {
                    if (password !== confirmPassword) {
                        req.flash('error', 'Password does not match.');
                        return res.redirect(`/profile`);
                    }
                    bcrypt.hash(password, 10, async (error, hash) => {
                        if (error) {
                            console.error("Error hashing password:", error);
                            req.flash('message', 'An error occurred. Please try again.');
                            return res.redirect(`/profile`);
                        }
                        const data = {
                            fullname: req.body.fullname,
                            email: req.body.email,
                            contact: req.body.contact,
                            password: hash
                        }
                        User.findByIdAndUpdate(userId, data, { new: true })
                            .then((user) => {
                                req.flash('message', 'Profile has been updated.');
                                return res.redirect('/users');
                            })
                            .catch((error) => {
                                console.error('Error updating data:', error);
                                req.flash('message', 'Update failed!');
                                return res.status(500).render('500', {
                                    user: user,
                                });
                            });
                    });
                } else {
                    const data = {
                        fullname: req.body.fullname,
                        email: req.body.email,
                        contact: req.body.contact,
                    }
                    User.findByIdAndUpdate(userId, data, { new: true })
                        .then((user) => {
                            req.flash('message', 'Profile has been updated.');
                            return res.redirect('/profile');
                        })
                        .catch((error) => {
                            console.error('Error updating data:', error);
                            req.flash('message', 'Update failed!');
                            return res.status(500).render('500', {
                                user: user,
                            });
                        });
                }
            } else {
                const existingEmail = await User.findOne({ email: email });
                if (existingEmail) {
                    req.flash('error', 'Email Already Used!');
                    return res.redirect(`/profile`);
                } else {
                    const password = req.body.password;
                    const confirmPassword = req.body.confirmPassword;
                    if (password) {
                        if (password !== confirmPassword) {
                            req.flash('error', 'Password does not match.');
                            return res.redirect(`/profile`);
                        }
                        bcrypt.hash(password, 10, async (error, hash) => {
                            if (error) {
                                console.error("Error hashing password:", error);
                                req.flash('message', 'An error occurred. Please try again.');
                                return res.redirect(`/profile`);
                            }
                            const data = {
                                fullname: req.body.fullname,
                                email: req.body.email,
                                contact: req.body.contact,
                                password: req.body.password
                            }
                            User.findByIdAndUpdate(userIdToEdit, data, { new: true })
                                .then((user) => {
                                    req.flash('message', 'Profile has been updated.');
                                    return res.redirect('/profile');
                                })
                                .catch((error) => {
                                    console.error('Error updating data:', error);
                                    req.flash('message', 'Update failed!');
                                    return res.status(500).render('500', {
                                        user: user,
                                    });
                                });
                        });
                    } else {
                        const data = {
                            fullname: req.body.fullname,
                            email: req.body.email,
                            contact: req.body.contact,
                        }
                        User.findByIdAndUpdate(userId, data, { new: true })
                            .then((user) => {
                                req.flash('message', 'User has been updated.');
                                return res.redirect('/profile');
                            })
                            .catch((error) => {
                                console.error('Error updating data:', error);
                                req.flash('message', 'Update failed!');
                                return res.status(500).render('500', {
                                    user: user,
                                });
                            });
                    }
                }
            }
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500', {
            user: user,
        })
    }

}