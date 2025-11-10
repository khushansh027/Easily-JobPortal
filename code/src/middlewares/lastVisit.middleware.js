export const trackLastVisit = (req, res, next) => {

    // 1. If 'lastVisit' cookie exists, store its value in a local variable after converting it to a readable string format.
    if (req.cookies.lastVisit) {
        // Convert the last visit timestamp from the cookie
        res.locals.lastVisit = new Date(req.cookies.lastVisit).toLocaleString(); // Convert it to a local date-time string
    }

    // 2. Set a new 'lastVisit' cookie with the current date and time, in ISO string format.
    // Name of the cookie // Current date-time in ISO string format
    res.cookie('lastVisit', new Date().toISOString(), {
        // Set the cookie's expiration time to 2 days from now in milliseconds
        maxAge: 2 * 24 * 60 * 60 * 1000, 
    });

    // Optionally, log the last visit time to the console (for debugging)
    console.log(`Last visit time for ${req.session.recruiterEmail || 'Guest'}: ${res.locals.lastVisit}`);

    // 3. Call the next middleware function in the stack.
    next();
};