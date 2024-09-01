import "dotenv/config";
import connectToDatabase from "./db/dbconnection.js";
import app from "./app.js";

connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
