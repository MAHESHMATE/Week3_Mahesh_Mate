import express, { Request, Response } from "express";
import {
  getWeatherOfCity,
  getLatestWeather,
  getAndSaveWeather,
} from "./Services/service";
import { sendEmail } from "./Services/mailService";

const app = express();
const port = 8000;

// defined Middleware to parse JSON bodies
app.use(express.json());

//-----------------------------------Q1-------------------------------------------------

// defined post method to save weather data for multiple cities
app.post("/api/SaveWeatherMapping", async (req, res) => {
  const cities = req.body; // get the list of cities from the request body
  await getAndSaveWeather(cities); // we fetch and save the weather data for these cities
  res.send("Weather data saved successfully."); // send a success message
});

//--------------------------------------------Q2-----------------------------------------------

// defined get method to fetch weather data for a specific city or all latest weather data
app.get("/api/weatherDashboard", async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string; // get the city from the query parameters

    if (city) {
      // if a city is specified, get weather data for that city
      const weatherData = await getWeatherOfCity(city);
      if (weatherData.length === 0) {
        // if no data is found for the city, return a 404 response
        return res
          .status(404)
          .json({ message: `No weather data found for city: ${city}` });
      }
      // return the weather data for the specified city
      return res.json(weatherData);
    } else {
      // if no city is specified, get the latest weather data for all cities
      const latestWeatherData = await getLatestWeather();
      return res.json(latestWeatherData); // returned the latest weather data
    }
  } catch (error: any) {
    // return an error response if an exception occurs
    console.error(`Error!! fetching weather data: ${error.message}`);
    return res.status(500).json({ message: "Internal server error!!" });
  }
});

//--------------------------------------------Q3-------------------------------------

// defined post method to send weather data via email
app.post("/api/weatherDashboardEmail", async (req: Request, res: Response) => {
  const { recipient, city } = req.body; // get the recipient email and city from request body

  try {
    let weatherData;

    if (city) {
      // if a city is specified, get weather data for that city
      weatherData = await getWeatherOfCity(city);
      if (weatherData.length === 0) {
        // if no data is found for the city, we return a 404 response
        return res
          .status(404)
          .json({ message: `No weather data found for city: ${city}` });
      }
    } else {
      // if no city is specified, get the latest weather data for all cities
      weatherData = await getLatestWeather();
    }

    // send the weather data to the recipient via email
    await sendEmail(recipient, weatherData);
    return res
      .status(200)
      .json({ message: "Weather data emailed successfully!!" }); // Return a success response
  } catch (error: any) {
    // log and return an error response if an exception occurs
    console.error(`Error!! sending weather email: ${error.message}`);
    return res.status(500).json({ message: "Internal server error!!" });
  }
});

// start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
