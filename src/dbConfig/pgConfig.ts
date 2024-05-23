import { Sequelize } from "sequelize";

// create a sequelize instance and configure the connection to the database
const sequelize = new Sequelize({
  username: "postgres",
  host: "localhost",
  database: "testdatabase",
  password: "mahesh@2627",
  port: 5432,
  dialect: "postgres",
});

// Authenticate the connection to the database
sequelize
  .authenticate()
  .then(() => {
    // if the connection is established, success message shown
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    // if the connection fails, error message shown
    console.error("Unable to connect to the database:", err);
  });

// synchronize the models with the database
sequelize
  .sync()
  .then(() => {
    // if the synchronization is successful, success message shown
    console.log("Models synchronized with the database.");
  })
  .catch((err) => {
    // if the synchronization fails, error message shown
    console.error("Unable to synchronize models with the database:", err);
  });

// export the sequelize instance
export default sequelize;
