import { useEffect, useState, useTransition } from "react";
import { Getapi } from "../Api/Api";
import Loading from "../pages/Loading";
import { motion } from "framer-motion";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("Islamabad");
  const [isPending, startTransition] = useTransition();

  const fetchapi = async (city) => {
    if (!city) {
      alert("Please Select The City First");
      return;
    }
    try {
      const res = await Getapi(city);
      startTransition(() => {
        setWeather(res.data);
        console.log(res.data);
      });
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  useEffect(() => {
    fetchapi(selectedCity);
  }, []);

  if (isPending) {
    return <Loading />;
  }

  const handleInput = (e) => {
    e.preventDefault();
    setSelectedCity(city);
    fetchapi(city);
    setCity("");
  };

  const getBackgroundClass = () => {
    if (!weather) return "from-blue-400 to-indigo-600";
    const temp = weather.current.temp_c;
    if (temp <= 10) return "from-blue-600 to-cyan-700";
    if (temp > 10 && temp <= 25) return "from-green-400 to-blue-500";
    return "from-orange-500 to-red-600";
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-start min-h-screen 
      bg-gradient-to-r ${getBackgroundClass()} text-white p-4 transition-all duration-700 overflow-x-hidden`}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="cloud -left-40 top-10" />
        <div className="cloud left-20 top-32" />
        <div className="cloud left-2/3 top-20" />
        <div className="cloud left-1/4 top-60" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl md:text-4xl font-extrabold mb-4 z-10 text-center drop-shadow-lg"
      >
        🌤 Weather App
      </motion.h1>

      <form
        onSubmit={handleInput}
        className="mb-4 flex flex-col sm:flex-row gap-2 w-full max-w-md z-10 px-2"
      >
        <motion.input
          whileFocus={{ scale: 1.05, boxShadow: "0 0 12px #FFD700" }}
          type="text"
          className="px-3 py-1.5 rounded-full text-black w-full sm:flex-1 focus:outline-none 
          border-2 border-yellow-200 focus:border-yellow-400 shadow-md transition-all duration-300
          placeholder:text-gray-500 placeholder:italic placeholder:opacity-70"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
        />
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #FFD700" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded-full 
          font-semibold shadow-md border-2 border-transparent hover:border-yellow-300 
          transition-all duration-300 w-full sm:w-auto"
        >
          Search ⚡
        </motion.button>
      </form>

      <div className="flex flex-col md:flex-row justify-center items-start gap-4 w-full max-w-6xl flex-1 overflow-hidden">

        {weather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/20 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-xl 
            w-full md:w-1/3 flex-shrink-0 border border-white/30 overflow-hidden"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-1 text-center">
              {weather.location.name}, {weather.location.country}
            </h2>
            <p className="text-xs md:text-sm opacity-80 mb-3 text-center">
              {weather.location.localtime} | {weather.location.tz_id}
            </p>

            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.img
                initial={{ rotate: -15 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.4 }}
                src={weather.current.condition.icon}
                alt="icon"
                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md"
              />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold drop-shadow-sm">
                  {weather.current.temp_c}°C
                </p>
                <p className="capitalize text-sm md:text-base">
                  {weather.current.condition.text}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
              <p>🌡 Feels Like: {weather.current.feelslike_c}°C</p>
              <p>💧 Humidity: {weather.current.humidity}%</p>
              <p>
                💨 Wind: {weather.current.wind_kph} kph{" "}
                {weather.current.wind_dir}
              </p>
              <p>🌬 Gust: {weather.current.gust_kph} kph</p>
              <p>📏 Pressure: {weather.current.pressure_mb} mb</p>
              <p>👁 Visibility: {weather.current.vis_km} km</p>
              <p>☀ UV Index: {weather.current.uv}</p>
              <p>🌦 Precip: {weather.current.precip_mm} mm</p>
            </div>
          </motion.div>
        )}

        {weather && weather.forecast && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 w-full">
            {weather.forecast.forecastday.slice(1,7).map((day, index) => {
              const dayName = new Date(day.date).toLocaleDateString("en-US", {
                weekday: "short",
              });
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/20 backdrop-blur-lg p-2 rounded-xl shadow-md flex flex-col items-center text-center"
                >
                  <p className="font-semibold">{dayName}</p>
                  <p className="text-xs opacity-80">{day.date}</p>
                  <img
                    src={day.day.condition.icon}
                    alt={day.day.condition.text}
                    className="w-10 h-10 md:w-12 md:h-12"
                  />
                  <p className="text-sm">{day.day.avgtemp_c}°C</p>
                  <p className="text-xs">{day.day.condition.text}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .cloud {
          position: absolute;
          width: 200px;
          height: 60px;
          background: #fff;
          border-radius: 50%;
          filter: blur(8px);
          opacity: 0.5;
          animation: moveClouds 60s linear infinite;
        }
        .cloud::before,
        .cloud::after {
          content: "";
          position: absolute;
          background: #fff;
          width: 100px;
          height: 100px;
          top: -20px;
          border-radius: 50%;
        }
        .cloud::before {
          left: -50px;
        }
        .cloud::after {
          right: -50px;
        }
        @keyframes moveClouds {
          from {
            transform: translateX(-300px);
          }
          to {
            transform: translateX(100vw);
          }
        }
      `}</style>
    </div>
  );
};

export default Weather;
