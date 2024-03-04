const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request')
const remarkBackUp = require('../../models/remark');
module.exports.index = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        const formrequests = await formRequest.find();
        if (user) {
            const AllDataRequestForms = formrequests
                .map(async (reqForm) => {
                    return {
                        reqForm: reqForm,
                        user: await User.findById(reqForm.userId)
                    };
                });

            const formData = await Promise.all(AllDataRequestForms);

            const userFormRequests = await formRequest.find({ userId: userId });
            const userDataPromises = userFormRequests
                .map(async (reqForm) => {
                    return {
                        reqForm: reqForm,
                        user: await User.findById(reqForm.userId)
                    };
                });

            const userData = await Promise.all(userDataPromises);
            const currentDate = new Date();
            const dateCreated = currentDate.toISOString().split('T')[0];
            const userFormRequestsToday = userFormRequests.filter(reqForm => {
                const reqFormDate = (reqForm.dateCreated);
                return reqFormDate === dateCreated;
            });
            if (user.role === 'admin') {
                res.render('admin/index', {
                    site_title: SITE_TITLE,
                    title: 'Home',
                    allFormRequests: formData,
                    messages: req.flash(),
                    currentUrl: req.originalUrl,
                    user: user,
                    userFormRequests: userData,
                    userFormRequestsToday:userFormRequestsToday,
                });
            } else {
                return res.render('404',{
                    user:user,
                })
            }
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500')
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
            const remarkbackup = new remarkBackUp({
                reqFormId: reqFormId,
                remark: req.body.remark,
            })
            await remarkbackup.save();
            const remark = {
                remark: req.body.remark,
                status: 'approved',
                adminApproved: dateCreated,
            }
            formRequest.findByIdAndUpdate(reqFormId, remark, { new: true })
                .then((remark) => {
                    req.flash('message', 'Approved Success!');
                    return res.redirect('/admin');

                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                    req.flash('message', 'Update failed!');
                    return res.status(500).render('500', {
                        user:user
                    });
                });
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('err:', error);
        return res.status(500).render('500', {
            user:user
        })
    }
}

module.exports.declined = async (req,res) => {
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
                adminDeclined: dateCreated,
            }
            formRequest.findByIdAndUpdate(reqFormId, data, { new: true })
                .then((remark) => {
                    req.flash('message', 'Request has been declined!');
                    return res.redirect('/admin');
                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                    req.flash('message', 'Update failed!');
                    return res.status(500).render('500', {
                        user:user
                    });
                });
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('err:', error);
        return res.status(500).render('500', {
            user:user
        });
    }
}
