import axios from "axios";
import { Weather } from "../Models/weatherModel";
import { QueryTypes } from "sequelize";

// storing API keys of geocoding and weather application
const GEO_API_KEY = "b0m4LrWQ47gtEoQxp/2FFA==k7cF8LIp7VtIkKih";
const WEATHER_API_KEY = "f3520db216mshd72fdfb39df6dd3p1cf414jsnd6ae31eb3830";

//------------------------------------------Q1----------------------------------

// created interface for city data
interface City {
  city: string;
  country: string;
}

// function to get coordinates of a city
async function Coordinates(city: string, country: string) {
  try {
    // using axios make an API call to geocoding API
    const response = await axios.get(
      "https://api.api-ninjas.com/v1/geocoding",
      {
        params: { city, country },
        headers: { "X-Api-Key": GEO_API_KEY },
      }
    );

    //----------------------------------Q4--------------------------------------
    // log the response data that come from geocoding API
    console.log("Response from geocoding API:", response.data);

    // Checking if response contains coordinates or not
    if (response.data.length === 0) {
      throw new Error(`No coordinates found of city ${city}, ${country}`);
    }
    return response.data[0];
  } catch (error: any) {
    console.error(
      `Error!! fetching coordinates of city ${city}, ${country}:`,
      error.message
    );
    throw new Error(`Error!! fetching coordinates of city ${city}, ${country}`);
  }
}

// defined function to get weather data of a city using latitude and longitude
async function weatherOfCity(latitude: number, longitude: number) {
  try {
    // using axios call API to get weather data
    const response = await axios.get(
      "https://weatherapi-com.p.rapidapi.com/current.json",
      {
        params: { q: `${latitude},${longitude}` },
        headers: {
          "X-RapidAPI-Key": WEATHER_API_KEY,
          "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Error!! fetching weather for coordinates (${latitude}, ${longitude}):`,
      error.message
    );
    throw new Error(
      `Error!! fetching weather for coordinates (${latitude}, ${longitude})`
    );
  }
}

// defined function to save weather data in the database
async function saveData(weatherData: any) {
  try {
    const newWeather = await Weather.create(weatherData); // creating a new weather record
    return newWeather;
  } catch (error: any) {
    console.error(
      `Error!! saving weather data for city ${weatherData.city}, ${weatherData.country}:`,
      error.message
    );
    throw new Error(
      `Error!! saving weather data for city ${weatherData.city}, ${weatherData.country}`
    );
  }
}

// defined function to fetch and save weather data for multiple cities
async function getAndSaveWeather(cities: City[]) {
  const errors: string[] = []; // defined an array to store errors

  for (const city of cities) {
    try {
      const coordinates = await Coordinates(city.city, city.country); // get coordinates
      const weather = await weatherOfCity(
        coordinates.latitude,
        coordinates.longitude
      ); // get weather data

      // created object named weatherData
      const weatherData = {
        city: city.city,
        country: city.country,
        weather: weather.current.condition.text,
        time: new Date(),
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
      };

      await saveData(weatherData); // saved the weather data in the database
      console.log(
        `Weather data for city ${city.city}, ${city.country} saved successfully.`
      );
    } catch (error: any) {
      const errorMessage = `Failed to process city ${city.city}, ${city.country}: ${error.message}`;
      console.error(errorMessage);
      errors.push(errorMessage); // add error message to understand the error
    }
  }

  // catch all the errors if any
  if (errors.length > 0) {
    console.error("Summary of errors:");
    errors.forEach((error) => console.error(error));
  }
}

//---------------------------------------------Q2--------------------------------------------------

// function to get weather data for a specific city
async function getWeatherOfCity(city: string) {
  return await Weather.findAll({
    where: { city }, // finding all weather records for the specified city
    order: [["time", "DESC"]], // get time in descending order
  });
}

// defined function to fetch the latest weather data of all cities
async function getLatestWeather() {
  // checking if Weather.sequelize is defined before accessing it
  const sequelizeInstance = Weather.sequelize;
  if (!sequelizeInstance) {
    throw new Error("Sequelize instance is undefined for weather model");
  }

  // defined query to get the latest weather data for each city
  const results = await sequelizeInstance.query(
    `
    SELECT DISTINCT ON (city) *
    FROM weathers
    ORDER BY city, time DESC
  `,
    { type: QueryTypes.SELECT }
  );
  return results;
}

// export the functions
export { getWeatherOfCity, getLatestWeather, getAndSaveWeather };
