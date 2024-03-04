const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request')

module.exports.index = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        const formrequests = await formRequest.find();
        if (user) {
            const AllDataRequestForms = formrequests
                .map(async (reqForm) => {
                    return {
                        reqForm: reqForm,
                        user: await User.findById(reqForm.userId)
                    };
                });

            // Resolve all promises
            const formData = await Promise.all(AllDataRequestForms);
            // This is for the user.login making a request
            const userFormRequests = await formRequest.find({ userId: userId });
            const userDataPromises = userFormRequests
                .map(async (reqForm) => {
                    return {
                        reqForm: reqForm,
                        user: await User.findById(reqForm.userId)
                    };
                });

            // Resolve all promises
            const userData = await Promise.all(userDataPromises);
            const currentDate = new Date();
            const dateCreated = currentDate.toISOString().split('T')[0];
            const userFormRequestsToday = userFormRequests.filter(reqForm => {
                const reqFormDate = (reqForm.dateCreated);
                return reqFormDate === dateCreated;
            });
            if (user.role === 'supply') {
                res.render('supply/index', {
                    site_title: SITE_TITLE,
                    title: 'Home',
                    allFormRequests: formData,
                    messages: req.flash(),
                    currentUrl: req.originalUrl,
                    user: user,
                    userFormRequests: userData,
                    userFormRequestsToday: userFormRequestsToday,
                });
            } else {
                return res.render('404', {
                    user: user,
                });
            }
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500',{
            user:user,
        });
    }
}

module.exports.approved = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        const currentDate = new Date();
        const dateCreated = currentDate.toISOString().split('T')[0];
        if (user) {
            const reqFormId = req.body.reqFormId;
            const remark = {
                remark: req.body.remark,
                status: 'process',
                supplyApproved: dateCreated,
            }
            formRequest.findByIdAndUpdate(reqFormId, remark, { new: true })
                .then((remark) => {
                    req.flash('message', 'Approved Success!');
                    return res.redirect('/supply');

                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                    req.flash('message', 'Update failed!');
                    return res.status(500).render('500', {
                        user: user,
                    });
                });
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('err:', error);
        return res.status(500).render('500', {
            user: user,
        })
    }
}

module.exports.declined = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        if (user) {
            const currentDate = new Date();
            const dateCreated = currentDate.toISOString().split('T')[0];
            const reqFormId = req.body.reqFormId;
            const data = {
                remark: req.body.remark,
                status: 'declined',
                supplyDeclined: dateCreated,
            }
            formRequest.findByIdAndUpdate(reqFormId, data, { new: true })
                .then((remark) => {
                    req.flash('message', 'Request has been declined!');
                    return res.redirect('/supply');
                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                    req.flash('message', 'Update failed!');
                    return res.status(500).render('500', {
                        user: user,
                    });
                });
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('err:', error);
        return res.status(500).render('500', {
            user: user,
        });
    }
}

module.exports.completed = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        if (user) {
            const reqFormId = req.body.reqFormId;
            const remark = {
                remark: req.body.remark,
                status: 'completed',
            }
            formRequest.findByIdAndUpdate(reqFormId, remark, { new: true })
                .then((remark) => {
                    req.flash('message', 'Request has been Completed!');
                    return res.redirect('/users/requests/process');
                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                    req.flash('message', 'Update failed!');
                    return res.status(500).render('500', {
                        user: user,
                    });
                });
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('err:', error);
        return res.status(500).render('500', {
            user: user,
        })
    }
}