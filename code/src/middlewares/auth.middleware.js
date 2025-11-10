export default function authUser(req, res, next) {
    // debugging:
    console.log('Session data in authUser middleware:', req.session);
    // Check if session has the recruiter's email (authentication status)
    if (req.session && req.session.recruiterEmail) {
        return next(); // Proceed if logged in as recruiter
    } else {
        // Redirect to login page if not authenticated
        return res.redirect('/login');
    }
}