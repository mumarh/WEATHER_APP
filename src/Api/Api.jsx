import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const Getapi = (city) => {
  return axios.get(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`
  );
};
