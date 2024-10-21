import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React from "react";

interface MapsProps {
  lat: number;
  lng: number;
}

const Maps: React.FC<MapsProps> = ({ lat, lng }) => {
  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  //Change lat and lng later!!!
  const defaultCenter = {
    lat: 40.9533756,
    lng: 29.1228841,
  };

  // const API_KEY = "AIzaSyCDz_k8lNGfTObbieC0a8yIUzfpL7uG97I"
  // const API_KEY = "AIzaSyCmlgoVTKJchswQ3XJzk9mf4CFFmxR6Ums"
  return (
    <LoadScript googleMapsApiKey="">
      <GoogleMap mapContainerStyle={mapStyles} center={defaultCenter} zoom={15}>
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Maps;