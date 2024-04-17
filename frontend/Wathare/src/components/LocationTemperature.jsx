import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

const LocationTemperature = () => {
  const [location, setLocation] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [locationName, setLocationName] = useState({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchLocationName = async () => {
      if (location) {
        try {
            const uri = `https://geocode.maps.co/reverse?lat=${location.latitude}&lon=${location.longitude}&api_key=661fde929ddef243061662ylxe8dd19`
          const response = await fetch(
            uri
          );
          
          const data = await response.json();
          setLocationName(data.address)
        //   setLocationName(data.results[0].formatted_address);
          console.log(locationName)
        } catch (error) {
          console.error("Error fetching location name:", error);
        }
      }
    };

    fetchLocationName();
  }, [location]);

  const getCurrentHourTemperature = (weatherData) => {
    const currentHour = new Date().getUTCHours();
    const index = weatherData.hourly.time.findIndex(
      (time) => time.getUTCHours() === currentHour
    );
    if (index !== -1) {
      setTemperature(weatherData.hourly.temperature2m[index]);
    }
  };

const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  useEffect(() => {
    const fetchWeather = async () => {
      if (location) {
        const { latitude, longitude } = location;

        const params = {
          latitude: latitude,
          longitude: longitude,
          hourly: "temperature_2m",
        };
        const url = "https://api.open-meteo.com/v1/forecast";

        try {
          const responses = await fetchWeatherApi(url, params);
          const response = responses[0];
          
          const utcOffsetSeconds = response.utcOffsetSeconds();
          const hourly = response.hourly();
          const weatherData = {
            hourly: {
              time: range(
                Number(hourly.time()),
                Number(hourly.timeEnd()),
                hourly.interval()
              ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
              temperature2m: hourly.variables(0).valuesArray(),
            },
          };
        getCurrentHourTemperature(weatherData);
        } catch (error) {
          console.error("Error fetching weather:", error);
        }
      }
    };
    console.log(location)
    fetchWeather();
  }, [location]);

  return (
    <div>
        
      {temperature !== null ? (
        <div>
        <p>Current temperature: {temperature}°C</p>
        <p>Location: {JSON.stringify(locationName.suburb + ", " + locationName.city + ", " + locationName.state)}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LocationTemperature;
