// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ejsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import recruiterController from './src/controller/recruiter.controller.js';
import jobRoutes from './jobRoutes.js';
import cookieParser from 'cookie-parser';
import { trackLastVisit } from './src/middlewares/lastVisit.middleware.js';
import methodOverride from 'method-override';


// Create custom __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = express();

// setup middleware
server.use(ejsLayouts);

// parse cookies
server.use(cookieParser());

// setup view engine settings
server.set('view engine', 'ejs');
server.set('views', path.join(path.resolve('src', 'views')));

// parse form data
server.use(express.urlencoded({ extended: true }));


// setup sessions
server.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // 1-hour session expiration
    maxAge: 1000 * 60 * 60,
    // Set to true if using HTTPS
    secure: false,
    // httpOnly: true
  },
}));

// Serve static files from the 'uploads' directory
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use method-override to support PUT and DELETE requests from forms
server.use(methodOverride('_method'));

/*
Home route
server.get('/', (req, res) => {
  res.render('layout', { body: 'home' });
}); */
// Home route with lastVisit tracking
server.get('/', trackLastVisit, (req, res) => {
  // Render the home layout, including the lastVisit and recruiterEmail if it exists
  res.render('home', { 
    // body: 'home',
    lastVisit: res.locals.lastVisit, // Pass lastVisit to the view
    recruiterEmail: req.session.recruiterEmail // Pass recruiterEmail to the view
  });
});

// Route to get redirected to home/landing page
server.get('/layout', (req, res) => {
  res.render('layout'); // Render the layout.ejs file
});

// Create an instance of the recruiterController to use its methods
const recruitersController = new recruiterController();

// signup routes
server.get('/signup', recruitersController.getSignedup);
server.post('/signup', recruitersController.postSignup);

// login routes
server.get('/login', recruitersController.getLogin);
server.post('/login', recruitersController.postLogin);

// Use the job routes
server.use('/', jobRoutes); // Use the job routes defined in jobRoutes.js

server.listen(3800, () => {
  console.log('Server listening on PORT 3800'); // Corrected port to 3800
});