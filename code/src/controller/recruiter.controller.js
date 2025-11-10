import recruiterModel from "../models/recruiter.model.js";

// Export the recruiterController class as the default export
export default class recruiterController {

    // Method to render the sign up form page
    getSignedup(req, res) {
        // Render the 'register.ejs' view to display the registration form
        // res.render('layout', { body: 'signup', errorMessage: null});
        res.render('signup', { errorMessage: null });
    }

    /* 
    Method to handle post-signup logic when a recruiter submits the registration form
    async postSignup(req, res) {
        // Extract the recruiter's input from the request body
        const { name, username, email, password } = req.body;

        // Debugging to check the input data
        console.log(req.body);

        try {
            // Check if the email already exists in the system using `isValidUser`
            const isUserExists = await recruiterModel.isValidUser(email);
            if (isUserExists) {
                return res.render('signup', { errorMessage: 'Email already exists.' });
            }

            // Add the new recruiter to the recruiters array or save to DB
            await recruiterModel.add({ name, username, email, password });

            // Store success message in session and redirect to login
            req.session.successMessage = 'Signup successful. Please login.';
            return res.redirect('/login');
        } catch (error) {
            console.error('Error saving recruiter:', error); // Log the error for debugging
            return res.render('signup', { errorMessage: 'An error occurred during signup. Please try again.' });
        }
    }*/
    // Method to handle post-signup logic when a recruiter submits the registration form
    async postSignup(req, res) {
        const { name, username, email, password } = req.body;

        // Debugging to check the input data
        console.log(req.body);

        try {
            // Check if the email already exists by searching the recruiters array
            const isUserExists = recruiterModel.getAllUsers().find((recruiter) => recruiter.email === email);
            console.log('isUserExists:',isUserExists);

            if (isUserExists) {
                return res.render('signup', { errorMessage: 'Email already exists.' });
            }

            // Add the new recruiter to the recruiters array (you could save this to a database as well)
            await recruiterModel.add(name, username, email, password);

            // Store success message in session and redirect to login
            req.session.successMessage = 'Signup successful. Please login.';
            return res.redirect('/login');
        } catch (error) {
            console.error('Error saving recruiter:', error); // Log the error for debugging
            return res.render('signup', { errorMessage: 'An error occurred during signup. Please try again.' });
        }
    }

    // Method to render the login page when a recruiter requests it
    getLogin(req, res) {
        res.render('login', {
            // body: 'login', // Pass 'login' for inclusion
            errorMessage: 'Invalid Credentials' // You can still pass error messages if needed
        });
    }

    /* 
    Method to handle the post-login logic when a recruiter submits the login form
    postLogin(req, res) {
        // Destructure username and password from the request body (form input data)
        const {username, password} = req.body;
        // debug
        console.log(req.body);

        // Use the isValidUser method from recruiterModel to verify if the recruiter exists and credentials match
        const recruiter = recruiterModel.isValidUser(username, password);
        //debug
        console.log("recruiter details:",recruiter);
        // If recruiter doesn't exist or credentials are wrong, re-render login page with an error message
        if (!recruiter) {
            return res.render('login', {
                // Error message shown to the recruiter if login fails
                errorMessage: 'Invalid Credentials'
            });
        }

        // Store the recruiter's email in the session to maintain login state
        req.session.recruiterEmail = recruiter.email;

        console.log('Session after login:', req.session); // Debugging line

        // After successful login, redirect to the previously requested page (if available) or to home
        // Default to home page if no redirect URL was stored
        const redirectTo = req.session.redirectTo || '/';
        
        console.log('Redirecting to:', redirectTo); // debugging line

        req.session.redirectTo = null; // Clear the redirect URL from session
        // delete req.session.redirectTo; // Clear the redirect URL from the session
        return res.redirect(redirectTo); // Redirect to the original page or home page
    }*/

    // Method to handle post-login logic when a recruiter submits the login form
    postLogin(req, res) {
        const { username, password } = req.body; // Changed to email and password

        // Debugging to check the input data
        console.log('post Login Body: ',req.body);

        // Use the isValidUser method to verify if the recruiter exists and credentials match
        const recruiter = recruiterModel.isValidUser(username, password); // Now checking with email and password
        console.log("recruiter details:", recruiter); // Debugging line

        // If recruiter doesn't exist or credentials are wrong, re-render login page with an error message
        if (!recruiter) {
            return res.render('login', {
                // Error message shown to the recruiter if login fails
                errorMessage: 'Invalid Credentials'
            });
        }

        // Store the recruiter's email in the session to maintain login state
        req.session.recruiterEmail = recruiter.email;

        console.log('Session after login:', req.session); // Debugging line

        // Redirect to the previously requested page or default to home page
        const redirectTo = req.session.redirectTo || '/';
        console.log('Redirecting to:', redirectTo); // Debugging line

        req.session.redirectTo = null; // Clear the redirect URL from session
        return res.redirect(redirectTo); // Redirect to the original page or home page
    }

}