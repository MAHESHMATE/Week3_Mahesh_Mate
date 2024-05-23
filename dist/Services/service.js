"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndSaveWeather = exports.getAllLatestWeather = exports.getWeatherByCity = void 0;
const axios_1 = __importDefault(require("axios"));
const weatherModel_1 = require("../Models/weatherModel");
const sequelize_1 = require("sequelize");
// API keys for geocoding and weather services
const GEO_API_KEY = 'b0m4LrWQ47gtEoQxp/2FFA==k7cF8LIp7VtIkKih';
const WEATHER_API_KEY = 'f3520db216mshd72fdfb39df6dd3p1cf414jsnd6ae31eb3830';
// Function to get coordinates (latitude and longitude) for a given city and country
function getCoordinates(city, country) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Make an API call to get geocoding data
            const response = yield axios_1.default.get('https://api.api-ninjas.com/v1/geocoding', {
                params: { city, country },
                headers: { 'X-Api-Key': GEO_API_KEY },
            });
            //----------------------------------Q4--------------------------------------
            // Log the response data for debugging
            console.log('Response from Geocoding API:', response.data);
            // Check if response contains coordinates
            if (response.data.length === 0) {
                throw new Error(`No coordinates found for ${city}, ${country}`);
            }
            return response.data[0];
        }
        catch (error) {
            console.error(`Error fetching coordinates for ${city}, ${country}:`, error.message);
            throw new Error(`Error fetching coordinates for ${city}, ${country}`);
        }
    });
}
// Function to get weather data for given latitude and longitude
function getWeather(latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Make an API call to get weather data
            const response = yield axios_1.default.get('https://weatherapi-com.p.rapidapi.com/current.json', {
                params: { q: `${latitude},${longitude}` },
                headers: {
                    'X-RapidAPI-Key': WEATHER_API_KEY,
                    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching weather for coordinates (${latitude}, ${longitude}):`, error.message);
            throw new Error(`Error fetching weather for coordinates (${latitude}, ${longitude})`);
        }
    });
}
// Function to save weather data to the database
function saveWeatherData(weatherData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newWeather = yield weatherModel_1.Weather.create(weatherData); // Create a new weather record
            return newWeather;
        }
        catch (error) {
            console.error(`Error saving weather data for ${weatherData.city}, ${weatherData.country}:`, error.message);
            throw new Error(`Error saving weather data for ${weatherData.city}, ${weatherData.country}`);
        }
    });
}
// Function to fetch and save weather data for multiple cities
function fetchAndSaveWeather(cities) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = []; // Array to store errors
        for (const city of cities) {
            try {
                const coordinates = yield getCoordinates(city.city, city.country); // Get coordinates
                const weather = yield getWeather(coordinates.latitude, coordinates.longitude); // Get weather data
                // Create weather data object
                const weatherData = {
                    city: city.city,
                    country: city.country,
                    weather: weather.current.condition.text,
                    time: new Date(),
                    longitude: coordinates.longitude,
                    latitude: coordinates.latitude,
                };
                yield saveWeatherData(weatherData); // Save weather data
                console.log(`Weather data for ${city.city}, ${city.country} saved successfully.`);
            }
            catch (error) {
                const errorMessage = `Failed to process ${city.city}, ${city.country}: ${error.message}`;
                console.error(errorMessage);
                errors.push(errorMessage); // Add error message to errors array
            }
        }
        // Log all errors if any
        if (errors.length > 0) {
            console.error('Summary of errors:');
            errors.forEach(error => console.error(error));
        }
    });
}
exports.fetchAndSaveWeather = fetchAndSaveWeather;
//---------------------------------------------Q2--------------------------------------------------
// Function to fetch weather data for a specific city
function getWeatherByCity(city) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield weatherModel_1.Weather.findAll({
            where: { city }, // Find all weather records for the specified city
            order: [['time', 'DESC']], // Order by time in descending order
        });
    });
}
exports.getWeatherByCity = getWeatherByCity;
// Function to fetch the latest weather data for all cities
function getAllLatestWeather() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if Weather.sequelize is defined before accessing it
        const sequelizeInstance = weatherModel_1.Weather.sequelize;
        if (!sequelizeInstance) {
            throw new Error('Sequelize instance is undefined for Weather model');
        }
        // Query to get the latest weather data for each city
        const results = yield sequelizeInstance.query(`
    SELECT DISTINCT ON (city) *
    FROM weathers
    ORDER BY city, time DESC
  `, { type: sequelize_1.QueryTypes.SELECT });
        return results;
    });
}
exports.getAllLatestWeather = getAllLatestWeather;
//# sourceMappingURL=service.js.map