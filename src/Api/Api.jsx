import axios from "axios";

const API_KEY = "4ed5af6cd0be464d92e90913252308";  

export const Getapi = (city) => {
  return axios.get(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`
  );
};