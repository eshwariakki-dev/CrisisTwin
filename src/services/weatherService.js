import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeather = async (city = "Bengaluru") => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    return response.data;
  } catch (error) {
    console.error("Weather API Error:", error);
    return null;
  }
};

export const getForecast = async (lat = 12.9716, lon = 77.5946) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    return response.data;
  } catch (error) {
    console.error("Forecast API Error:", error);
    return null;
  }
};