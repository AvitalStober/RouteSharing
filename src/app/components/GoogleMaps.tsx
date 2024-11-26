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

// "use client";
// import React, { useState, useRef } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   DirectionsRenderer,
//   Marker,
//   Polygon,
// } from "@react-google-maps/api";

// const Map = () => {
//   const [address, setAddress] = useState(""); // לשמור את הכתובת
//   const [center, setCenter] = useState<google.maps.LatLngLiteral>({
//     lat: 32.0853,
//     lng: 34.7818,
//   });
//   const polygonRef = useRef<google.maps.Polygon | null>(null); // לשמור את הפוליגון הצהוב
//   const mapRef = useRef<google.maps.Map | null>(null); // ה-ref של המפה
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
//         if (areaPoints.length > 2) {
//           // צור את הפוליגון כאשר יש מספיק נקודות
//           const polygon = new google.maps.Polygon({
//             paths: [...areaPoints, newPoint], // כוללים את הנקודה החדשה
//             fillColor: "yellow",
//             fillOpacity: 0.4,
//             strokeColor: "yellow",
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//           });
//           polygon.setMap(mapRef.current); // הוספת הפוליגון למפה דרך ה-ref
//           polygonRef.current = polygon; // שמור את הפוליגון
//         }
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
//         // שלוף את כל הנקודות שבין התחלה וסיום
//         const allRoutePoints: google.maps.LatLngLiteral[] = [];
//         const route = result.routes[0];

//         // הוסף את נקודת ההתחלה
//         allRoutePoints.push({
//           lat: route.legs[0].start_location.lat(),
//           lng: route.legs[0].start_location.lng(),
//         });

//         // עבור על כל ה-legs והוסף את כל הנקודות
//         route.legs.forEach((leg) => {
//           leg.steps.forEach((step) => {
//             // const stepLatLng = step.end_location;
//             // allRoutePoints.push({
//             //   lat: stepLatLng.lat(),
//             //   lng: stepLatLng.lng(),
//             // });
//             allRoutePoints.push({
//               lat: step.end_location.lat(),
//               lng: step.end_location.lng(),
//             });
//           });
//         });

//         setRoutePoints(allRoutePoints); // עדכון המערך עם כל הנקודות
//         console.log(allRoutePoints);

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
//     // אם יש פוליגון ונתוני מסלול
//     if (polygonRef.current && routePoints.length > 0) {
//       let allPointsInside = true; // נתחיל בהנחה שכל הנקודות בתוך האזור

//       // עבור על כל נקודות המסלול
//       for (const point of routePoints) {
//         const latLng = new google.maps.LatLng(point.lat, point.lng);

//         // בדוק אם הנקודה בתוך הפוליגון
//         const isInside = google.maps.geometry.poly.containsLocation(
//           latLng,
//           polygonRef.current
//         );

//         // אם לפחות אחת מהנקודות מחוץ לאזור, נשנה את הדגל
//         if (!isInside) {
//           allPointsInside = false;
//           break;
//         }
//       }
//       console.log(allPointsInside);

//       // הצגת הודעה לפי התוצאה
//       if (allPointsInside) {
//         alert("כל נקודות המסלול נמצאות בתוך האזור.");
//       } else {
//         alert("יש נקודות במסלול שלא נמצאות בתוך האזור.");
//       }
//     }
//   };

//   const handleAddressSubmit = () => {
//     const geocoder = new google.maps.Geocoder();

//     geocoder.geocode({ address }, (results, status) => {
//       if (status === google.maps.GeocoderStatus.OK && results!.length > 0) {
//         const location = results![0].geometry.location;

//         // עדכון מרכז המפה
//         setCenter({
//           lat: location.lat(),
//           lng: location.lng(),
//         });

//         if (mapRef.current) {
//           mapRef.current.setZoom(15); // זום למיקום
//         }
//       } else {
//         alert("כתובת לא נמצאה, נסה שוב.");
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col">
//          <div className="flex justify-center items-center mb-4 mt-4 space-x-2">
//           <input
//             type="text"
//             placeholder="הזן כתובת לחיפוש"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             className="px-4 py-2 border rounded"
//           />
//           <button
//             onClick={handleAddressSubmit}
//             className="px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             חפש כתובת
//           </button>
//         </div>
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
//         libraries={["geometry"]}
//       >
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "500px" }}
//           center={center}
//           zoom={13}
//           onClick={handleMapClick}
//           onLoad={(map) => {
//             mapRef.current = map; // שמור את המפה ב-ref ברגע שהיא נטענת
//           }}
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
import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";

const Map = () => {
  const [address, setAddress] = useState(""); // לשמור את הכתובת
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 32.0853,
    lng: 34.7818,
  });
  const polygonRef = useRef<google.maps.Polygon | null>(null); // לשמור את הפוליגון הצהוב
  const mapRef = useRef<google.maps.Map | null>(null); // ה-ref של המפה
  const autocompleteRef = useRef<HTMLInputElement | null>(null); // ה-ref עבור ה-input של הכתובת
  const [mode, setMode] = useState<"route" | "area">("route");
  const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>(
    []
  );
  const [areaPoints, setAreaPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY || "",
    libraries: ["geometry", "places"],
    language: "he",
  });

//   useEffect(() => {
//     if (isLoaded && autocompleteRef.current) {
//       const autocomplete = new google.maps.places.Autocomplete(
//         autocompleteRef.current
//       );

//       autocomplete.addListener("place_changed", () => {
//         const place = autocomplete.getPlace();
//         if (place.geometry && place.geometry.location) {
//           const location = place.geometry.location;
//           setCenter({
//             lat: location.lat(),
//             lng: location.lng(),
//           });

//           setRoutePoints((prevPoints) => [
//             ...prevPoints,
//             {
//               lat: location.lat(),
//               lng: location.lng(),
//             },
//           ]);

//           if (mapRef.current) {
//             mapRef.current.setZoom(15); // זום למיקום
//           }
//         }
//       });
//     }
//   }, [isLoaded]);
useEffect(() => {
    if (isLoaded && autocompleteRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        autocompleteRef.current
      );
  
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
  
        if (place.geometry && place.geometry.location) {
          const location = place.geometry.location;
  
          // עדכון מרכז המפה
          setCenter({
            lat: location.lat(),
            lng: location.lng(),
          });
  
          // הוסף את הנקודה הנבחרת למסלול
          setRoutePoints((prevPoints) => [
            ...prevPoints,
            {
              lat: location.lat(),
              lng: location.lng(),
            },
          ]);
  
          // זום למיקום הנבחר
          if (mapRef.current) {
            mapRef.current.setZoom(15);
          }
  
          // עדכון הכתובת בתיבת החיפוש
          const formattedAddress = place.formatted_address || ''; // אם לא נמצא, השתמש בברירת מחדל ריקה
          setAddress(formattedAddress);
        }
      });
    }
  }, [isLoaded]);
  

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
          const polygon = new google.maps.Polygon({
            paths: [...areaPoints, newPoint],
            fillColor: "yellow",
            fillOpacity: 0.4,
            strokeColor: "yellow",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          });
          polygon.setMap(mapRef.current);
          polygonRef.current = polygon;
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
        const allRoutePoints: google.maps.LatLngLiteral[] = [];
        const route = result.routes[0];

        allRoutePoints.push({
          lat: route.legs[0].start_location.lat(),
          lng: route.legs[0].start_location.lng(),
        });

        route.legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            allRoutePoints.push({
              lat: step.end_location.lat(),
              lng: step.end_location.lng(),
            });
          });
        });

        setRoutePoints(allRoutePoints);
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
    if (polygonRef.current && routePoints.length > 0) {
      let allPointsInside = true;

      for (const point of routePoints) {
        const latLng = new google.maps.LatLng(point.lat, point.lng);

        const isInside = google.maps.geometry.poly.containsLocation(
          latLng,
          polygonRef.current
        );

        if (!isInside) {
          allPointsInside = false;
          break;
        }
      }

      if (allPointsInside) {
        alert("כל נקודות המסלול נמצאות בתוך האזור.");
      } else {
        alert("יש נקודות במסלול שלא נמצאות בתוך האזור.");
      }
    }
  };

  const handleAddressSubmit = () => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results!.length > 0) {
        const location = results![0].geometry.location;
        console.log("location type ", typeof location);

        setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });

        setRoutePoints((prevPoints) => [
          ...prevPoints,
          {
            lat: location.lat(),
            lng: location.lng(),
          },
        ]);

        if (mapRef.current) {
          mapRef.current.setZoom(15);
        }
      } else {
        alert("כתובת לא נמצאה, נסה שוב.");
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center mb-4 mt-4 space-x-2">
        <input
          ref={autocompleteRef}
          type="text"
          placeholder="הזן כתובת לחיפוש"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={handleAddressSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          חפש כתובת
        </button>
      </div>
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

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={center}
          zoom={13}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {routePoints.map((point, index) => (
            <Marker
              key={`route-${index}`}
              position={point}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          ))}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "red",
                  strokeOpacity: 0.8,
                  strokeWeight: 5,
                },
              }}
            />
          )}
          {areaPoints.length > 2 && (
            <Polygon
              path={areaPoints}
              options={{
                fillColor: "yellow",
                fillOpacity: 0.4,
                strokeColor: "yellow",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}
          {areaPoints.map((point, index) => (
            <Marker
              key={`area-${index}`}
              position={point}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              }}
            />
          ))}
        </GoogleMap>
      ) : (
        <div>טוען מפה...</div>
      )}
    </div>
  );
};

export default Map;

// "use client";
// import React, { useState, useRef } from "react";
// import {
//   GoogleMap,
//   LoadScript,
// } from "@react-google-maps/api";

// const Map = () => {
//   const [address, setAddress] = useState("");
//   const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null); // מרכז המפה
//   const mapRef = useRef<google.maps.Map | null>(null); // ה-ref של המפה

//   const handleAddressSubmit = async () => {
//     if (!address.trim()) {
//       alert("נא להזין כתובת.");
//       return;
//     }

//     if (window.google) {
//       const geocoder = new window.google.maps.Geocoder();

//       geocoder.geocode({ address }, (results, status) => {
//         if (status === "OK" && results && results.length > 0) {
//           const location = results[0].geometry.location;
//           setCenter({ lat: location.lat(), lng: location.lng() });
//         } else {
//           alert("לא ניתן למצוא את הכתובת.");
//         }
//       });
//     } else {
//       alert("Google Maps API לא נטען.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="הזן כתובת התחלה"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="border rounded px-4 py-2 mr-2"
//         />
//         <button
//           onClick={handleAddressSubmit}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           קבע מיקום
//         </button>
//       </div>

//       <LoadScript googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY}`}>
//         {center && (
//           <GoogleMap
//             mapContainerStyle={{ width: "100%", height: "500px" }}
//             center={center}
//             zoom={13}
//             onLoad={(map) => {
//               mapRef.current = map; // שמור את המפה ב-ref ברגע שהיא נטענת
//             }}
//           />
//         )}
//       </LoadScript>
//       {!center && <p>אנא הזן כתובת כדי להציג את המפה.</p>}
//     </div>
//   );
// };

// export default Map;
