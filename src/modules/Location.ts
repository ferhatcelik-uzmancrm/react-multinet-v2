import { useState } from "react";

const center = {
  lat: 40.9533756,
  lng: 29.1228841,
};

const HandleCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(center);

  // Get the user's current location using the Geolocation API
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
      console.log(currentLocation);
    },
    (error) => {
      console.error("Error getting current location:", error);
    }
  );
};

export default HandleCurrentLocation;
