const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request');

module.exports.index = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    try {
        if (user) {
            const userFormRequests = await formRequest.find({userId: userId});
            const userDataPromises = userFormRequests
                .map(async (reqForm) => {
                    return {
                        reqForm: reqForm,
                        user: await User.findById(reqForm.userId)
                    };
                });

            // Resolve all promises
            const userData = await Promise.all(userDataPromises);
            if (user.role === 'member') {
                res.render('member/requestStatus', {
                    site_title: SITE_TITLE,
                    title: 'Requests',
                    userFormRequests:userData,
                    currentUrl: req.originalUrl,
                    user: user,
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
        return res.status(500).render('500',{
            user:user,
        })
    }
}