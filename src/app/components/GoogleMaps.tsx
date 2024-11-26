// "use client";
// import React, { useState } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   DirectionsRenderer,
//   Marker,
//   Polygon,
// } from "@react-google-maps/api";

// const Map = () => {
//   const [mode, setMode] = useState<"route" | "area">("route");
//   const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>(
//     []
//   );
//   const [areaPoints, setAreaPoints] = useState<google.maps.LatLngLiteral[]>([]);
//   const [directions, setDirections] =
//     useState<google.maps.DirectionsResult | null>(null);

//   const handleMapClick = (event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const newPoint = {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       };

//       if (mode === "route") {
//         setRoutePoints((prevPoints) => [...prevPoints, newPoint]);
//       } else {
//         setAreaPoints((prevPoints) => [...prevPoints, newPoint]);
//       }
//     }
//   };

//   const calculateRoute = () => {
//     if (routePoints.length < 2) {
//       alert("עליך לבחור לפחות שתי נקודות למסלול.");
//       return;
//     }

//     const directionsService = new google.maps.DirectionsService();

//     const request: google.maps.DirectionsRequest = {
//       origin: routePoints[0],
//       destination: routePoints[routePoints.length - 1],
//       waypoints: routePoints.slice(1, -1).map((point) => ({
//         location: point,
//         stopover: true,
//       })),
//       travelMode: google.maps.TravelMode.WALKING,
//     };

//     directionsService.route(request, (result, status) => {
//       if (status === google.maps.DirectionsStatus.OK && result) {
//         setDirections(result);
//       } else {
//         alert("לא ניתן לחשב מסלול.");
//       }
//     });
//   };

//   const resetMap = () => {
//     setRoutePoints([]);
//     setAreaPoints([]);
//     setDirections(null);
//   };

//   const displayPoints = () => {
//     if (mode === "route") {
//       alert(`נקודות המסלול: ${JSON.stringify(routePoints, null, 2)}`);
//       console.log(`נקודות המסלול: ${JSON.stringify(routePoints, null, 2)}`);
//     } else {
//       alert(`נקודות האזור: ${JSON.stringify(areaPoints, null, 2)}`);
//       console.log(`נקודות האזור: ${JSON.stringify(areaPoints, null, 2)}`);
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="flex justify-center mb-4 space-x-2">
//         <button
//           onClick={() => setMode("route")}
//           className={`px-4 py-2 ${
//             mode === "route" ? "bg-blue-500" : "bg-gray-500"
//           } text-white rounded`}
//         >
//           מסלול
//         </button>
//         <button
//           onClick={() => setMode("area")}
//           className={`px-4 py-2 ${
//             mode === "area" ? "bg-blue-500" : "bg-gray-500"
//           } text-white rounded`}
//         >
//           אזור
//         </button>
//         <button
//           onClick={calculateRoute}
//           className="px-4 py-2 bg-green-500 text-white rounded"
//         >
//           חישוב מסלול
//         </button>
//         <button
//           onClick={resetMap}
//           className="px-4 py-2 bg-red-500 text-white rounded"
//         >
//           איפוס מפה
//         </button>
//         <button
//           onClick={displayPoints}
//           className="px-4 py-2 bg-yellow-500 text-white rounded"
//         >
//           הצגת נקודות
//         </button>
//       </div>

//       <LoadScript
//         googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY}`}
//       >
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "500px" }}
//           center={{ lat: 32.0853, lng: 34.7818 }}
//           zoom={13}
//           onClick={handleMapClick}
//         >
//           {/* מצייני מסלול */}
//           {routePoints.map((point, index) => (
//             <Marker
//               key={`route-${index}`}
//               position={point}
//               icon={{
//                 url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // אייקון אדום למסלול
//               }}
//             />
//           ))}
//           {directions && (
//             <DirectionsRenderer
//               directions={directions}
//               options={{
//                 polylineOptions: {
//                   strokeColor: "red", // קו אדום למסלול
//                   strokeOpacity: 0.8,
//                   strokeWeight: 5,
//                 },
//               }}
//             />
//           )}

//           {/* מצייני אזור */}
//           {areaPoints.length > 2 && (
//             <Polygon
//               path={areaPoints}
//               options={{
//                 fillColor: "yellow", // מילוי צהוב לאזור
//                 fillOpacity: 0.4,
//                 strokeColor: "yellow",
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//               }}
//             />
//           )}

//           {/* מצייני נקודות צהובות עבור האזור */}
//           {areaPoints.map((point, index) => (
//             <Marker
//               key={`area-${index}`}
//               position={point}
//               icon={{
//                 url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // אייקון צהוב עבור האזור
//               }}
//             />
//           ))}
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// };

// export default Map;

"use client";
import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Marker,
  Polygon,
} from "@react-google-maps/api";

const Map = () => {
  const polygonRef = useRef<google.maps.Polygon | null>(null); // לשמור את הפוליגון הצהוב
  const mapRef = useRef<google.maps.Map | null>(null); // ה-ref של המפה
  const [mode, setMode] = useState<"route" | "area">("route");
  const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>(
    []
  );
  const [areaPoints, setAreaPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPoint = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      if (mode === "route") {
        setRoutePoints((prevPoints) => [...prevPoints, newPoint]);
      } else {
        setAreaPoints((prevPoints) => [...prevPoints, newPoint]);
        if (areaPoints.length > 2) {
          // צור את הפוליגון כאשר יש מספיק נקודות
          const polygon = new google.maps.Polygon({
            paths: [...areaPoints, newPoint], // כוללים את הנקודה החדשה
            fillColor: "yellow",
            fillOpacity: 0.4,
            strokeColor: "yellow",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          });
          polygon.setMap(mapRef.current); // הוספת הפוליגון למפה דרך ה-ref
          polygonRef.current = polygon; // שמור את הפוליגון
        }
      }
    }
  };

  const calculateRoute = () => {
    if (routePoints.length < 2) {
      alert("עליך לבחור לפחות שתי נקודות למסלול.");
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    const request: google.maps.DirectionsRequest = {
      origin: routePoints[0],
      destination: routePoints[routePoints.length - 1],
      waypoints: routePoints.slice(1, -1).map((point) => ({
        location: point,
        stopover: true,
      })),
      travelMode: google.maps.TravelMode.WALKING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        setDirections(result);
      } else {
        alert("לא ניתן לחשב מסלול.");
      }
    });
  };

  const resetMap = () => {
    setRoutePoints([]);
    setAreaPoints([]);
    setDirections(null);
  };

  const displayPoints = () => {
    // אם יש פוליגון ונתוני מסלול
    if (polygonRef.current && routePoints.length > 0) {
      let allPointsInside = true; // נתחיל בהנחה שכל הנקודות בתוך האזור

      // עבור על כל נקודות המסלול
      for (const point of routePoints) {
        const latLng = new google.maps.LatLng(point.lat, point.lng);

        // בדוק אם הנקודה בתוך הפוליגון
        const isInside = google.maps.geometry.poly.containsLocation(
          latLng,
          polygonRef.current
        );

        // אם לפחות אחת מהנקודות מחוץ לאזור, נשנה את הדגל
        if (!isInside) {
          allPointsInside = false;
          break;
        }
      }
      console.log(allPointsInside);

      // הצגת הודעה לפי התוצאה
      if (allPointsInside) {
        alert("כל נקודות המסלול נמצאות בתוך האזור.");
      } else {
        alert("יש נקודות במסלול שלא נמצאות בתוך האזור.");
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => setMode("route")}
          className={`px-4 py-2 ${
            mode === "route" ? "bg-blue-500" : "bg-gray-500"
          } text-white rounded`}
        >
          מסלול
        </button>
        <button
          onClick={() => setMode("area")}
          className={`px-4 py-2 ${
            mode === "area" ? "bg-blue-500" : "bg-gray-500"
          } text-white rounded`}
        >
          אזור
        </button>
        <button
          onClick={calculateRoute}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          חישוב מסלול
        </button>
        <button
          onClick={resetMap}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          איפוס מפה
        </button>
        <button
          onClick={displayPoints}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          הצגת נקודות
        </button>
      </div>

      <LoadScript
        googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY}`}
        libraries={["geometry"]}
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={{ lat: 32.0853, lng: 34.7818 }}
          zoom={13}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map; // שמור את המפה ב-ref ברגע שהיא נטענת
          }}
        >
          {/* מצייני מסלול */}
          {routePoints.map((point, index) => (
            <Marker
              key={`route-${index}`}
              position={point}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // אייקון אדום למסלול
              }}
            />
          ))}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "red", // קו אדום למסלול
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {/* מצייני אזור */}
          {areaPoints.length > 2 && (
            <Polygon
              path={areaPoints}
              options={{
                fillColor: "yellow", // מילוי צהוב לאזור
                fillOpacity: 0.4,
                strokeColor: "yellow",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}

          {/* מצייני נקודות צהובות עבור האזור */}
          {areaPoints.map((point, index) => (
            <Marker
              key={`area-${index}`}
              position={point}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // אייקון צהוב עבור האזור
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;