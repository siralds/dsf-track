const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request')

module.exports.index = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        if (user) {
            res.render('member/createReq', {
                site_tile: SITE_TITLE,
                title: 'Request',
                currentUrl: req.originalUrl,
                user: user,
            })
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500', {
            user:user
        })
    }
}

module.exports.submit = async (req, res) => {
    const userId = req.session.login
    const user = await User.findById(userId)
    try {
        const currentDate = new Date();
        const dateCreated = currentDate.toISOString().split('T')[0];
        if (user) {
            const formData = new formRequest({
                userId: user._id,
                purpose: req.body.purpose,
                dateCreated: dateCreated,
                status: 'pending',
            });
            const savedRequest = await formData.save();
            if (savedRequest) {
                return res.status(200).render('member/createReqSuccess', {
                    currentUrl: req.originalUrl,
                    title: 'Success',
                    site_title: SITE_TITLE,
                    user: user,
                });
            } else {
                req.flash('error', 'Something went wrong!');
                return res.status(500).render('500', {
                    user: user
                });
            }

        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500', {
            user: user
        })
    }
}

module.exports.edit = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId)
    if (user) {
        const reqFormId = req.params.id;
        if (reqFormId) {
            const formToEdit = await formRequest.findById(reqFormId);
            res.render('member/reqEdit', {
                title: 'Edit',
                site_title: SITE_TITLE,
                user: user,
                formToEdit: formToEdit,
                currentUrl: req.originalUrl
            })
        } else {
            return res.status(404).render('404', {
                user: user,
            })
        }
    } else {
        return res.redirect('/login')
    }
}

module.exports.doEdit = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        if (user) {
            const reqFormId = req.params.id;
            const formUpdate = {
                purpose: req.body.purpose,
            }
            formRequest.findByIdAndUpdate(reqFormId, formUpdate, { new: true })
                .then((savedData) => {
                    console.log('success', savedData);
                    req.flash('message', 'Creation Success!');
                    if (user.role === 'member') {
                        return res.redirect('/');
                    } else if (user.role === 'admin') {
                        return res.redirect('/admin');
                    } else if (user.role === 'supply') {
                        return res.redirect('/supply');
                    } else if (user.role === 'superAdmin') {
                        return res.redirect('/requests/pending');
                    }
                })
                .catch((error) => {
                    console.error('Error saving data:', error);
                    req.flash('failed', 'Creation failed!');
                    return res.status(500).render('500', {
                        user: user,
                    });
                });
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('error:', error);
        return res.status(500).render('500', {
            user: user
        })
    }
}