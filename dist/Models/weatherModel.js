"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
const sequelize_1 = require("sequelize");
const pgConfig_1 = __importDefault(require("../dbConfig/pgConfig"));
// Define a class that extends the Sequelize Model and implements the WeatherAttributes interface
class Weather extends sequelize_1.Model {
}
exports.Weather = Weather;
// Initialize the Weather model with its attributes and options
Weather.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER, // Integer type for ID
        primaryKey: true, // Primary key
        autoIncrement: true, // Auto-incrementing ID
    },
    city: {
        type: sequelize_1.DataTypes.STRING, // String type for city name
        allowNull: false, // City name cannot be null
    },
    country: {
        type: sequelize_1.DataTypes.STRING, // String type for country name
        allowNull: false, // Country name cannot be null
    },
    weather: {
        type: sequelize_1.DataTypes.STRING, // String type for weather description
        allowNull: false, // Weather description cannot be null
    },
    time: {
        type: sequelize_1.DataTypes.DATE, // Date type for timestamp
        allowNull: false, // Timestamp cannot be null
    },
    longitude: {
        type: sequelize_1.DataTypes.FLOAT, // Float type for longitude coordinate
        allowNull: false, // Longitude cannot be null
    },
    latitude: {
        type: sequelize_1.DataTypes.FLOAT, // Float type for latitude coordinate
        allowNull: false, // Latitude cannot be null
    },
}, {
    sequelize: pgConfig_1.default, // Pass the sequelize instance
    tableName: 'weathers', // Specify the table name in the database
    timestamps: false, // Disable automatic timestamps
});
//# sourceMappingURL=weatherModel.js.map