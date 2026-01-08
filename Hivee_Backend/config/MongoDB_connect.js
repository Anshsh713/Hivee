const mongoose = require("mongoose"); // Getting MongoDB

const MongoDB_Connecting = async () => {
  // Promise Function as first database connect then server runs
  try {
    // connecting MongoDB database by URL in .env file
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    //Error occurs as database is not correct or URL as server will not run
    console.error("MongoDB Not Connected reason ,", error);
    process.exit(1);
  }
};

module.exports = MongoDB_Connecting;
