import dotenv from "dotenv";

dotenv.config({ path: '../.env' }); 

const MONGODB_URL = process.env.MONGODB_URL;

// Check if MONGODB_URL is defined
if (!MONGODB_URL) {
    console.error("MONGODB_URL is not defined in the environment variables.");
    process.exit(1); // Exit if the MongoDB URL is not provided
}

// Set 'strictQuery' to false to avoid deprecation warnings
mongoose.set('strictQuery', false);

exports.connect = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((error) => {
        console.log("DB connection FAILED");
        console.error(error);
        process.exit(1);
    });
};

// Call the connect function to initiate the connection when running this file directly
exports.connect();
