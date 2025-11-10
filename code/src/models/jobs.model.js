export default class JobModel {
    static jobs = [
        {
            id: 1,
            company: "Coding Ninjas",
            position: "SDE",
            location: "Gurgaon|Remote",
            salary: "12-14 LPA",
            skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
            applyBy: "19/10/24",
            isHiring: true,
            postedAt: new Date().toLocaleString(),
            applicants: []  // Initializing as an empty array
        },
        {
            id: 2,
            company: "Google",
            position: "SDE",
            location: "Noida|Hybrid",
            salary: "10-12 LPA",
            skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
            applyBy: "19/10/24",
            isHiring: true,
            postedAt: new Date().toLocaleString(),
            applicants: []
        },
        {
            id: 3,
            company: "Amazon",
            position: "SDE",
            location: "Mumbai|Office",
            salary: "12-14 LPA",
            skills: ["REACT", "NodeJs", "JS", "SQL", "MongoDB", "Express", "AWS"],
            applyBy: "19/10/24",
            isHiring: true,
            postedAt: new Date().toLocaleString(),
            applicants: []
        },
    ]; 

    constructor(id, title, location, salary) {
        this.id = id;
        this.title = title;
        this.location = location;
        this.salary = salary;
    }

    static getAllJobs() {
        return this.jobs; // Use this.jobs
    }

    static getJobById(id) {
        return this.jobs.find(job => job.id === Number(id)); // Use this.jobs
    }

    static updateJob(id, updatedDetails) {
        const job = this.getJobById(id);

        if (job) {
            for (let key in updatedDetails) {
                if (job.hasOwnProperty(key)) {
                    job[key] = updatedDetails[key];
                }
            }
            return job;
        } else {
            return null;
        }
    }

    static addJob(newJob) {
        this.jobs.push(newJob); // Use this.jobs
    }

    static deleteJob(id) {
        const index = this.jobs.findIndex(job => job.id === id); // Use this.jobs
        if (index !== -1) {
            this.jobs.splice(index, 1); // Use this.jobs
            return this.jobs; // Use this.jobs
        }
        return null;
    }

    static addApplicant(jobId, applicant) {

        // Find the job in the jobs array based on the jobId passed
        const job = this.jobs.find(job => job.id === jobId);
        
        // If the job exists:
        if(job){
            // Push the applicant's details to applicants array
            job.applicants.push(applicant);
            console.log('Job found:\n', job);
        }// If the job is not found:
        else{
            // Throw an error saying "Job not found"
            throw new Error("Job not found");
        }
    }
}
