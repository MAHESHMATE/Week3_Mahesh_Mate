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
const express_1 = __importDefault(require("express"));
const service_1 = require("./Services/service");
const mailService_1 = require("./Services/mailService");
const app = (0, express_1.default)();
const port = 8000;
// Middleware to parse JSON bodies in incoming requests
app.use(express_1.default.json());
//-----------------------------------Q1-------------------------------------------------
// Endpoint to save weather data for multiple cities
app.post('/api/SaveWeatherMapping', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cities = req.body; // Get the list of cities from the request body
    yield (0, service_1.fetchAndSaveWeather)(cities); // Fetch and save the weather data for these cities
    res.send("Weather data saved successfully."); // Send a success response
}));
//--------------------------------------------Q2-----------------------------------------------
// Endpoint to fetch weather data for a specific city or all latest weather data
app.get('/api/weatherDashboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = req.query.city; // Get the city from the query parameters
        if (city) {
            // If a city is specified, get weather data for that city
            const weatherData = yield (0, service_1.getWeatherByCity)(city);
            if (weatherData.length === 0) {
                // If no data is found for the city, return a 404 response
                return res.status(404).json({ message: `No weather data found for city: ${city}` });
            }
            // Return the weather data for the specified city
            return res.json(weatherData);
        }
        else {
            // If no city is specified, get the latest weather data for all cities
            const latestWeatherData = yield (0, service_1.getAllLatestWeather)();
            return res.json(latestWeatherData); // Return the latest weather data
        }
    }
    catch (error) {
        // Log and return an error response if an exception occurs
        console.error(`Error fetching weather data: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
//--------------------------------------------Q3-------------------------------------
// Endpoint to send weather data via email
app.post('/api/weatherDashboardEmail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipient, city } = req.body; // Get the recipient email and city from the request body
    try {
        let weatherData;
        if (city) {
            // If a city is specified, get weather data for that city
            weatherData = yield (0, service_1.getWeatherByCity)(city);
            if (weatherData.length === 0) {
                // If no data is found for the city, return a 404 response
                return res.status(404).json({ message: `No weather data found for city: ${city}` });
            }
        }
        else {
            // If no city is specified, get the latest weather data for all cities
            weatherData = yield (0, service_1.getAllLatestWeather)();
        }
        // Send the weather data to the recipient via email
        yield (0, mailService_1.sendWeatherEmail)(recipient, weatherData);
        return res.status(200).json({ message: 'Weather data emailed successfully' }); // Return a success response
    }
    catch (error) {
        // Log and return an error response if an exception occurs
        console.error(`Error sending weather email: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=app.js.map