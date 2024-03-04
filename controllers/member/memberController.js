const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request')

module.exports.index = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        if (user) {
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
            if (user.role === 'member') {
                res.render('member/index', {
                    site_title: SITE_TITLE,
                    title: 'Home',
                    userFormRequests: userData,
                    messages: req.flash(),
                    currentUrl: req.originalUrl,
                    user: user,
                    userFormRequestsToday: userFormRequestsToday,
                });
            } else {
                return res.render('404', {
                    user: user,
                })
            }
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500', {
            user: user
        })
    }
}

module.exports.requestDelete = async (req, res) => {
    const reqId = req.body.reqId;
    const user = await User.findById(req.session.login);
    try {
        if (user) {
            await formRequest.findByIdAndDelete(reqId)
            req.flash('message', 'Request Form has been deleted!');
            if (user.role === 'admin') {
                return res.redirect('/admin');
            } else if (user.role === 'member') {
                return res.redirect('/');
            } else if (user.role === 'supply') {
                return res.redirect('/supply');
            } else if (user.role === 'superAdmin') {
                return res.redirect('/requests/pending');
            }
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500', {
            user: user
        });
    }
}