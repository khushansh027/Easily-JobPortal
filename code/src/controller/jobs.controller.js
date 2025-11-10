import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
import JobModel from "../models/jobs.model.js";


// Export the recruiterController class as the default export
export default class JobsController {

    static getAllJobs(req, res){
        return res.json(JobModel.jobs);
    };

    // Method to get job by ID
    // Method to handle displaying job details
    static getJobDetails(req, res) {
        // Extract job ID from request parameters
        const { id } = req.params;
        
        // Fetch the job by ID using your JobModel
        const job = JobModel.getJobById(parseInt(id));

        // Check if the job exists
        if (job) {
            // Pass the correct view path as body, along with job and recruiterEmail
            const recruiterEmail = req.session.recruiterEmail || null;
            // Render the jobDesc view and pass the job and recruiterEmail
            return res.render('jobDesc', { job, recruiterEmail});

        } else {
            // Send 404 if the job is not found
            return res.status(404).send("Job not found !!");
        }
    };

    // Method to create a new job
    static createJob(req, res) {
        // Destructure job details from the request body (form input data)
        const {id,company,position,location,salary,skills} = req.body;

        // Validate request body fields
        if (!id || !company || !position || !location || !salary || !skills) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Create a new job instance
        const newJob = new JobModel(id,company,position,location,salary,skills);

        // Add the new job to the jobs array
        JobModel.addJob(newJob);
        res.status(201).json(newJob);
    };

    // Method to delete an existing job
    static deleteJob(req, res) {
        // Get ID from request parameters
        const {id} = req.params;
        // Delete the job with the specified ID
        const remainingJobs = JobModel.deleteJob(parseInt(id));

        // re-render page to see the leftover jobs
        if(remainingJobs){
            // Redirect to the remaining jobs on the page.
            res.redirect('/jobs');
        }else{
            res.status(404).json({message: "Job not found !!"});
        }
    };

    /* Method to update an existing job
    static async updateJob(req, res) {
        try {
            // Get ID from request parameters
            const { id } = req.params;

            // Destructure the updated job details from the request body
            const { company, position, location, salary, skills } = req.body;

            // Validate request body fields
            if (!company || !position || !location || !salary || !skills) {
                return res.status(400).json({ message: "All fields are required!" });
            }

            // Call the updateJob method from the JobModel
            const updatedJob = await JobModel.updateJob(parseInt(id), { company, position, location, salary, skills });

            // Check if the job was updated successfully
            if (updatedJob) {
                res.status(200).json(updatedJob); // Return the updated job
            } else {
                res.status(404).json({ message: "Job not found!" }); // Job not found
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ message: "Server error!" }); // Handle unexpected errors
        }
    }*/

    // Method to update an existing job
    static async updateJob(req, res) {
        try {
            // Get ID from request parameters
            const { id } = req.params;

            // Destructure the updated job details from the request body
            const { company, position, location, salary, skills } = req.body;

            // Validate request body fields
            if (!company || !position || !location || !salary || !skills) {
                return res.status(400).json({ message: "All fields are required!" });
            }

            // Convert skills from a comma-separated string to an array
            const skillsArray = skills.split(',').map(skill => skill.trim());

            // Call the updateJob method from the JobModel, passing the skills as an array
            const updatedJob = await JobModel.updateJob(parseInt(id), {
                company,
                position,
                location,
                salary,
                skills: skillsArray // Save the skills as an array
            });

            // Check if the job was updated successfully
            if (updatedJob) {
                // Redirect to the jobs page with updated details
                res.redirect('/jobs'); 
                // res.status(200).json(updatedJob); // Return the updated job
            } else {
                res.status(404).json({ message: "Job not found!" }); // Job not found
            }
        }
        catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ message: "Server error!" }); // Handle unexpected errors
        }
    }


    // Method to add store details  
    static applyForJob(req, res){

        // get the job id applicant is applying for
        const {id} = req.params;
        console.log(id);

        // collect applicant details
        const {name, email, contact } = req.body;
        const resume = req.file.filename;

        // Validate applicant details
        if (!name || !email || !contact || !resume) {
            console.log("Body:", req.body); // Log request body for debugging
            console.log("File:", req.file); // Log file for debugging
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Create the applicant object
        const applicant = { name, email, contact, resume };
        
        // try adding applicants details post-validating, send confirmation
        try{
            // Add the applicant to the job in the model
            JobModel.addApplicant(parseInt(id), applicant);

            // Configure Nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'khushansh.arora2@gmail.com',
                    pass: 'rsowqmeazyffucml'
                }
            });

            // Fetch job details from the model by job ID
            const job = JobModel.getJobById(parseInt(id));

            // Define recievers
            const mailOptions = {
                from: 'khushansh.arora2@gmail.com',
                to: email,
                subject: `Application Confirmation: ${job.position} at ${job.company}`,
                html: `
                  <h1>Dear ${name},</h1>
                  <p>Thank you for applying to <u><strong><strong>${job.company}</strong></u>
                  for the role of <u><strong>${job.position}</strong></u>.</p>
                  <p>We have received your application and will get back to you soon.</p>
                  <p>Best Regards,</p>
                  <p><strong>Team Easily</strong></p>
                `
            };
            // Send the email using Nodemailer
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                // Handle error in case the email couldn't be sent
                console.error('Error while sending confirmation email:', error);
                return res.status(500).send('Error while sending confirmation email.');
                }
                console.log('Confirmation email sent:', info.response);

                // Redirect the user to the jobs listing page after successfully sending the email
                res.redirect(`/jobs`);
            });
        }
        catch(error){ // ask applicant to try to apply again
            console.error('Error in applyForJob:', error);
            res.status(404).send(
                {errorMessage: "Not applied. Try Again!!"}
            );
        }
        console.log('Applicant who applied here are there details:\n'+applicant);
    };

    // Method to store applicants details in applicants array
    static getApplicantsInfo(req, res){
        // Get the job id from the URL parameters
        const { id } = req.params;

        // Fetch the job details by id from the JobModel
        const job = JobModel.getJobById(parseInt(id));
    
        // If the job doesn't exist, return a 404
        if (!job) {
            return res.status(404).send('Job not found');
        }
    
        // Retrieve the list of applicants for the job
        const applicants = job.applicants;
    
        // Render the 'applicants.ejs' view, passing job and applicants data
        res.render('applicants', { 
            // body: 'applicants',
            job,
            applicants 
        });
    }
    
}