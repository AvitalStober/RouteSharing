import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const MapComponent: React.FC<{ points: google.maps.LatLngLiteral[] }> = ({
  points,
}) => {
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  // משתני זמן כסטייט
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  const mapContainerStyle = { width: "100%", height: "250px" };
  const center = points.length > 0 ? points[0] : { lat: 0, lng: 0 };

  const calculateRoute = () => {
    if (points.length < 2) {
      alert("עליך לבחור לפחות שתי נקודות למסלול.");
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const request: google.maps.DirectionsRequest = {
      origin: points[0],
      destination: points[points.length - 1],
      waypoints: points.slice(1, -1).map((point) => ({
        location: point,
        stopover: true,
      })),
      travelMode: google.maps.TravelMode.WALKING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        calculateWalkingTime(result);
        setDirections(result);
      } else {
        alert("לא ניתן לחשב מסלול.");
      }
    });
  };

  const calculateWalkingTime = (result: google.maps.DirectionsResult) => {
    let totalTimeInSeconds = 0;

    const route = result.routes[0];

    route.legs.forEach((leg) => {
      totalTimeInSeconds += leg.duration!.value;
    });

    // המרת הזמן לשעות, דקות ושניות
    const calculatedHours = Math.floor(totalTimeInSeconds / 3600); // שעות
    const calculatedMinutes = Math.floor((totalTimeInSeconds % 3600) / 60); // דקות

    // עדכון הסטייט של השעות והדקות
    setHours(calculatedHours);
    setMinutes(calculatedMinutes);

    console.log(`הזמן הכולל להליכה: ${calculatedHours} שעות, ${calculatedMinutes} דקות`);
  };

  return (
    <>
      <button onClick={calculateRoute}>calculateRoute</button>

      <LoadScript googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY}`}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
        >
          {points.map((point, index) => (
            <Marker key={index} position={point} />
          ))}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <p>הזמן הכולל להליכה: {hours} שעות, {minutes} דקות</p>
    </>
  );
};

export default MapComponent;
