"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Create a new Sequelize instance and configure the connection to the PostgreSQL database
const sequelize = new sequelize_1.Sequelize({
    username: "postgres", // Database username
    host: "localhost", // Database host
    database: "testdatabase", // Database name
    password: "mahesh@2627", // Database password
    port: 5432, // Database port
    dialect: "postgres", // Type of database (PostgreSQL)
});
// Authenticate the connection to the database
sequelize
    .authenticate()
    .then(() => {
    // If the connection is successful, log a success message
    console.log("Database connection established successfully.");
})
    .catch((err) => {
    // If the connection fails, log an error message
    console.error("Unable to connect to the database:", err);
});
// Synchronize the models with the database
sequelize
    .sync()
    .then(() => {
    // If the synchronization is successful, log a success message
    console.log("Models synchronized with the database.");
})
    .catch((err) => {
    // If the synchronization fails, log an error message
    console.error("Unable to synchronize models with the database:", err);
});
// Export the Sequelize instance for use in other parts of the application
exports.default = sequelize;
//# sourceMappingURL=pgConfig.js.map