import mongoose from "mongoose";

const connectDb = async (uri) => {
  try {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("You successfully connected to MongoDB");
    return connection;
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
};

process.on("SIGINT", async function () {
  console.log("App is terminating");
  process.exit(0);
});

export default connectDb;
