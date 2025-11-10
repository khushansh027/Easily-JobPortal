// Export the recruiterModel class as the default export
export default class recruiterModel {
    // Constructor to initialize a new recruiter object with id, name, email, and password
    constructor(id, name, username, email, password) {
        this.id = id; // Unique ID for the recruiter
        this.name = name; // Name of the recruiter
        this.username = username; // Username of the recruiter
        this.email = email; // Email of the recruiter
        this.password = password; // Password of the recruiter
    }

    // Static method to add a new recruiter to the recruiters array
    static add(name, username, email, password) {
        // Create a new recruiter object using the recruiterModel constructor
        const newRecruiter = new recruiterModel(
            recruiters.length + 1, // Assign a new id based on the length of the recruiters array
            name,
            username, // Set the name as the username provided
            email, // Set the email as the email provided
            password// Set the password as the password provided
        );
        recruiters.push(newRecruiter); // Add the new recruiter object to the recruiters array
    }

    // Static method to check if a recruiter with a matching email and password exists
    static isValidUser(username, password) {
        // Find the recruiter in the recruiters array that matches the provided email and password
        const result = recruiters.find(
            (recruiter) => recruiter.username === username && recruiter.password === password
        );
        console.log('recuiters array: ',recruiters);
        console.log(result); // debug
        return result; // Return the matched recruiter object if found, else undefined
    }

    static getAllUsers(){
        return recruiters;
    }
}

// recruiters array to hold all the recruiter objects
var recruiters = [];
