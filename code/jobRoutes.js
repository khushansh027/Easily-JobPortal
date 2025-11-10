// src/routes/jobRoutes.js
import express from 'express';
import multer from 'multer';
import JobModel from './src/models/jobs.model.js'; // Import JobModel
import JobsController from './src/controller/jobs.controller.js'; // Import JobsController
import authUser from './src/middlewares/auth.middleware.js';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Setup multer for file uploads 
const upload = multer({ storage: storage }); // Specify the destination for uploaded files

// Define routes
router.get('/jobs', (req, res) => {
  const jobs = JobModel.jobs; // Fetch jobs from your model
  // res.render('layout', { body: 'jobs', jobs });
  res.render("jobs", { jobs });
});

/* add job.ejs -- to be made
router.get('/jobs/add', (req, res) => {
  res.render('addJob');
}); */

// Job fetching route
router.get('/jobs/:id', JobsController.getJobDetails);

//
router.get('/search', (req, res) => {
  const query = req.query.query; // Get the search query from the URL
  const results = JobModel.jobs.filter(job => 
      job.position.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase())
  ); // Filter based on job position or company

  res.render('searchJob', { results, query }); // Pass results and query to your view
});
// Job creation route
router.post('/jobs', JobsController.createJob);

// Job updation route
// 1 route should trigger the updateJob in the controller, 1 route should render the ejs file i suppose
router.get('/jobs/:id/edit', async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await JobModel.getJobById(jobId); // Fetch the job from the database
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }
    res.render('updateJob', { job });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
});


router.put('/jobs/:id/', JobsController.updateJob);

// Job deletion route
router.delete('/jobs/:id/delete', JobsController.deleteJob);

// Job application route
router.post('/jobs/:id/apply', upload.single('resume'), JobsController.applyForJob);

// Job applicant info route, accessible only by authenticated recruiters
router.get('/jobs/applicants/:id', authUser, JobsController.getApplicantsInfo);

// Job applicant info getting route
// router.get('/jobs/applicants/:id', JobsController.getApplicantsInfo);


export default router;