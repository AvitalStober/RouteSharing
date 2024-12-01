// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import {
//   GoogleMap,
//   DirectionsRenderer,
//   Marker,
//   Polygon,
//   useJsApiLoader,
// } from "@react-google-maps/api";

// const Map = () => {
//   const [address, setAddress] = useState("");
//   const [center, setCenter] = useState<google.maps.LatLngLiteral>({
//     lat: 32.0853,
//     lng: 34.7818,
//   });
//   const polygonRef = useRef<google.maps.Polygon | null>(null);
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const autocompleteRef = useRef<HTMLInputElement | null>(null);
//   const [mode, setMode] = useState<"route" | "area">("route");
//   const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>([]);
//   const [areaPoints, setAreaPoints] = useState<google.maps.LatLngLiteral[]>([]);
//   const [directions, setDirections] =
//     useState<google.maps.DirectionsResult | null>(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY || "",
//     libraries: ["geometry", "places"],
//     language: "he",
//   });

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
//             mapRef.current.setZoom(15);
//           }

//           const formattedAddress = place.formatted_address || "";
//           setAddress(formattedAddress);
//         }
//       });
//     }
//   }, [isLoaded]);

//   const handleMapClick = (event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const newPoint = {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       };

//       console.log("newPoint ", newPoint);

//       if (mode === "route") {
//         // הוספת נקודה למסלול (לא שונה)
//         setRoutePoints((prevPoints) => [...prevPoints, newPoint]);
//       } else {
//         // עדכון נקודות האזור עם מיון לפי קרבה
//         setAreaPoints((prevPoints) => {
//           const updatedPoints = sortPointsByProximity([...prevPoints, newPoint]);
//           console.log("Updated AreaPoints: ", updatedPoints);

//           // בניית הפוליגון רק אם יש יותר מ-2 נקודות
//           if (updatedPoints.length > 2) {
//             const polygon = new google.maps.Polygon({
//               paths: updatedPoints,
//               fillColor: "yellow",
//               fillOpacity: 0.4,
//               strokeColor: "yellow",
//               strokeOpacity: 0.4,
//               strokeWeight: 0.4,
//             });
//             polygon.setMap(mapRef.current);
//             console.log("Polygon: ", polygon);

//             polygonRef.current = polygon;
//           }

//           return updatedPoints;
//         });
//       }
//     }
//   };

//   const sortPointsByProximity = (points: google.maps.LatLngLiteral[]) => {
//     if (points.length <= 2) return points;

//     const sortedPoints = [points[0]];
//     const remainingPoints = points.slice(1);

//     while (remainingPoints.length) {
//       const lastPoint = sortedPoints[sortedPoints.length - 1];
//       let closestIndex = 0;
//       let closestDistance = google.maps.geometry.spherical.computeDistanceBetween(
//         new google.maps.LatLng(lastPoint),
//         new google.maps.LatLng(remainingPoints[0])
//       );

//       remainingPoints.forEach((point, index) => {
//         const distance = google.maps.geometry.spherical.computeDistanceBetween(
//           new google.maps.LatLng(lastPoint),
//           new google.maps.LatLng(point)
//         );

//         if (distance < closestDistance) {
//           closestDistance = distance;
//           closestIndex = index;
//         }
//       });

//       sortedPoints.push(remainingPoints.splice(closestIndex, 1)[0]);
//     }

//     return sortedPoints;
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

//     // אם יש פוליגון שמור, נסיר אותו מהמפה
//     if (polygonRef.current) {
//       polygonRef.current.setMap(null); // מסיר את הפוליגון מהמפה
//       polygonRef.current = null; // מאפס את ה-referene
//     }
//   };

//   const displayPoints = () => {
//     if (polygonRef.current && routePoints.length > 0) {
//       let allPointsInside = true;

//       for (const point of routePoints) {
//         const latLng = new google.maps.LatLng(point.lat, point.lng);

//         const isInside = google.maps.geometry.poly.containsLocation(
//           latLng,
//           polygonRef.current
//         );

//         if (!isInside) {
//           allPointsInside = false;
//           break;
//         }
//       }

//       if (allPointsInside) {
//         alert("כל נקודות המסלול נמצאות בתוך האזור.");
//       } else {
//         alert("יש נקודות במסלול שלא נמצאות בתוך האזור.");
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="flex justify-center items-center mb-4 mt-4 space-x-2">
//         <input
//           ref={autocompleteRef}
//           type="text"
//           placeholder="הזן כתובת לחיפוש"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="px-4 py-2 border rounded"
//         />
//         <button
//           onClick={() => {
//             alert("הפונקציה לחיפוש כתובת פועלת אך אינה כוללת שינוי נקודות בשלב זה.");
//           }}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           חפש כתובת
//         </button>
//       </div>
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

//       {isLoaded ? (
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "500px" }}
//           center={center}
//           zoom={13}
//           onClick={handleMapClick}
//           onLoad={(map) => {
//             mapRef.current = map;
//           }}
//         >
//           {routePoints.map((point, index) => (
//             <Marker
//               key={`route-${index}`}
//               position={point}
//               icon={{
//                 url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
//               }}
//             />
//           ))}
//           {directions && (
//             <DirectionsRenderer
//               directions={directions}
//               options={{
//                 polylineOptions: {
//                   strokeColor: "red",
//                   strokeOpacity: 0.8,
//                   strokeWeight: 5,
//                 },
//               }}
//             />
//           )}
//           {areaPoints.length > 2 && (
//             <Polygon
//               path={areaPoints}
//               options={{
//                 fillColor: "yellow",
//                 fillOpacity: 0.4,
//                 strokeColor: "yellow",
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//               }}
//             />
//           )}
//           {areaPoints.map((point, index) => (
//             <Marker
//               key={`area-${index}`}
//               position={point}
//               icon={{
//                 url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
//               }}
//             />
//           ))}
//         </GoogleMap>
//       ) : (
//         <div>טוען מפה...</div>
//       )}
//     </div>
//   );
// };

// export default Map;

// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import {
//   GoogleMap,
//   DirectionsRenderer,
//   Marker,
//   Polygon,
//   useJsApiLoader,
// } from "@react-google-maps/api";

// const Map = () => {
//   const [address, setAddress] = useState(""); // לשמור את הכתובת
//   const [center, setCenter] = useState<google.maps.LatLngLiteral>({
//     lat: 32.0853,
//     lng: 34.7818,
//   });
//   const polygonRef = useRef<google.maps.Polygon | null>(null); // לשמור את הפוליגון הצהוב
//   const mapRef = useRef<google.maps.Map | null>(null); // ה-ref של המפה
//   const autocompleteRef = useRef<HTMLInputElement | null>(null); // ה-ref עבור ה-input של הכתובת
//   const [mode, setMode] = useState<"route" | "area">("route");
//   const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>(
//     []
//   );
//   const [areaPoints, setAreaPoints] = useState<google.maps.LatLngLiteral[]>([]);
//   const [directions, setDirections] =
//     useState<google.maps.DirectionsResult | null>(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY || "",
//     libraries: ["geometry", "places"],
//     language: "he",
//   });

//   useEffect(() => {
//     if (isLoaded && autocompleteRef.current) {
//       const autocomplete = new google.maps.places.Autocomplete(
//         autocompleteRef.current
//       );

//       autocomplete.addListener("place_changed", () => {
//         const place = autocomplete.getPlace();

//         if (place.geometry && place.geometry.location) {
//           const location = place.geometry.location;

//           // עדכון מרכז המפה
//           setCenter({
//             lat: location.lat(),
//             lng: location.lng(),
//           });

//           // הוסף את הנקודה הנבחרת למסלול
//           setRoutePoints((prevPoints) => [
//             ...prevPoints,
//             {
//               lat: location.lat(),
//               lng: location.lng(),
//             },
//           ]);

//           // זום למיקום הנבחר
//           if (mapRef.current) {
//             mapRef.current.setZoom(15);
//           }

//           // עדכון הכתובת בתיבת החיפוש
//           const formattedAddress = place.formatted_address || ""; // אם לא נמצא, השתמש בברירת מחדל ריקה
//           setAddress(formattedAddress);
//         }
//       });
//     }
//   }, [isLoaded]);

//   // const handleMapClick = (event: google.maps.MapMouseEvent) => {
//   //   if (event.latLng) {
//   //     const newPoint = {
//   //       lat: event.latLng.lat(),
//   //       lng: event.latLng.lng(),
//   //     };

//   //     console.log("newPoint ", newPoint);

//   //     if (mode === "route") {
//   //       setRoutePoints((prevPoints) => [...prevPoints, newPoint]);
//   //     } else {
//   //       setAreaPoints((prevPoints) => {
//   //         const updatedPoints = [...prevPoints, newPoint];
//   //         console.log("Updated AreaPoints: ", updatedPoints);

//   //         // בניית הפוליגון רק אם יש יותר מ-2 נקודות
//   //         if (updatedPoints.length > 2) {
//   //           const polygon = new google.maps.Polygon({
//   //             paths: updatedPoints,
//   //             fillColor: "yellow",
//   //             fillOpacity: 0.1,
//   //             strokeColor: "yellow",
//   //             strokeOpacity: 0.8,
//   //             strokeWeight: 2,
//   //           });
//   //           polygon.setMap(mapRef.current);
//   //           console.log("Polygon: ", polygon);

//   //           polygonRef.current = polygon;
//   //         }

//   //         return updatedPoints;
//   //       });
//   //     }
//   //   }
//   // };

//   const handleMapClick = (event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const newPoint = {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       };

//       console.log("newPoint ", newPoint);

//       if (mode === "route") {
//         // הוספת נקודה למסלול (לא שונה)
//         setRoutePoints((prevPoints) => [...prevPoints, newPoint]);
//       } else {
//         // עדכון נקודות האזור עם מיון לפי קרבה
//         setAreaPoints((prevPoints) => {
//           const updatedPoints = sortPointsByProximity([
//             ...prevPoints,
//             newPoint,
//           ]);
//           console.log("Updated AreaPoints: ", updatedPoints);

//           // בניית הפוליגון רק אם יש יותר מ-2 נקודות
//           if (updatedPoints.length > 2) {
//             const polygon = new google.maps.Polygon({
//               paths: updatedPoints,
//               fillColor: "yellow",
//               fillOpacity: 0.4,
//               strokeColor: "yellow",
//               strokeOpacity: 0.4,
//               strokeWeight: 0.4,
//             });
//             polygon.setMap(mapRef.current);
//             console.log("Polygon: ", polygon);

//             polygonRef.current = polygon;
//           }

//           return updatedPoints;
//         });
//       }
//     }
//   };

//   const sortPointsByProximity = (points: google.maps.LatLngLiteral[]) => {
//     if (points.length <= 2) return points;

//     const sortedPoints = [points[0]];
//     const remainingPoints = points.slice(1);

//     while (remainingPoints.length) {
//       const lastPoint = sortedPoints[sortedPoints.length - 1];
//       let closestIndex = 0;
//       let closestDistance =
//         google.maps.geometry.spherical.computeDistanceBetween(
//           new google.maps.LatLng(lastPoint),
//           new google.maps.LatLng(remainingPoints[0])
//         );

//       remainingPoints.forEach((point, index) => {
//         const distance = google.maps.geometry.spherical.computeDistanceBetween(
//           new google.maps.LatLng(lastPoint),
//           new google.maps.LatLng(point)
//         );

//         if (distance < closestDistance) {
//           closestDistance = distance;
//           closestIndex = index;
//         }
//       });

//       sortedPoints.push(remainingPoints.splice(closestIndex, 1)[0]);
//     }

//     return sortedPoints;
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
//         const allRoutePoints: google.maps.LatLngLiteral[] = [];
//         const route = result.routes[0];

//         allRoutePoints.push({
//           lat: route.legs[0].start_location.lat(),
//           lng: route.legs[0].start_location.lng(),
//         });

//         route.legs.forEach((leg) => {
//           leg.steps.forEach((step) => {
//             allRoutePoints.push({
//               lat: step.end_location.lat(),
//               lng: step.end_location.lng(),
//             });
//           });
//         });

//         setRoutePoints(allRoutePoints);
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

//     // אם יש פוליגון שמור, נסיר אותו מהמפה
//     if (polygonRef.current) {
//       polygonRef.current.setMap(null); // מסיר את הפוליגון מהמפה
//       polygonRef.current = null; // מאפס את ה-referene
//     }
//   };

//   const displayPoints = () => {
//     if (polygonRef.current && routePoints.length > 0) {
//       let allPointsInside = true;

//       for (const point of routePoints) {
//         const latLng = new google.maps.LatLng(point.lat, point.lng);

//         const isInside = google.maps.geometry.poly.containsLocation(
//           latLng,
//           polygonRef.current
//         );

//         if (!isInside) {
//           allPointsInside = false;
//           break;
//         }
//       }

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
//         console.log("location type ", typeof location);

//         setCenter({
//           lat: location.lat(),
//           lng: location.lng(),
//         });

//         setRoutePoints((prevPoints) => [
//           ...prevPoints,
//           {
//             lat: location.lat(),
//             lng: location.lng(),
//           },
//         ]);

//         if (mapRef.current) {
//           mapRef.current.setZoom(15);
//         }
//       } else {
//         alert("כתובת לא נמצאה, נסה שוב.");
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="flex justify-center items-center mb-4 mt-4 space-x-2">
//         <input
//           ref={autocompleteRef}
//           type="text"
//           placeholder="הזן כתובת לחיפוש"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="px-4 py-2 border rounded"
//         />
//         <button
//           onClick={handleAddressSubmit}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           חפש כתובת
//         </button>
//       </div>
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

//       {isLoaded ? (
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "500px" }}
//           center={center}
//           zoom={13}
//           onClick={handleMapClick}
//           onLoad={(map) => {
//             mapRef.current = map;
//           }}
//         >
//           {routePoints.map((point, index) => (
//             <Marker
//               key={`route-${index}`}
//               position={point}
//               icon={{
//                 url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
//               }}
//             />
//           ))}
//           {directions && (
//             <DirectionsRenderer
//               directions={directions}
//               options={{
//                 polylineOptions: {
//                   strokeColor: "red",
//                   strokeOpacity: 0.8,
//                   strokeWeight: 5,
//                 },
//               }}
//             />
//           )}
//           {areaPoints.length > 2 && (
//             <Polygon
//               path={areaPoints}
//               options={{
//                 fillColor: "yellow",
//                 fillOpacity: 0.4,
//                 strokeColor: "yellow",
//                 strokeOpacity: 0.8,
//                 strokeWeight: 2,
//               }}
//             />
//           )}
//           {areaPoints.map((point, index) => (
//             <Marker
//               key={`area-${index}`}
//               position={point}
//               icon={{
//                 url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
//               }}
//             />
//           ))}
//         </GoogleMap>
//       ) : (
//         <div>טוען מפה...</div>
//       )}
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
  const [isCircular, setIsCircular] = useState(false);
  const [isFirstPointClicked, setIsFirstPointClicked] = useState(false); // האם הנקודה הראשונה נבחרה מחדש

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLMAPS_API_KEY || "",
    libraries: ["geometry", "places"],
    language: "he",
  });

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
          const formattedAddress = place.formatted_address || ""; // אם לא נמצא, השתמש בברירת מחדל ריקה
          setAddress(formattedAddress);
        }
      });
    }
  }, [isLoaded]);

  // const handleMapClick = (event: google.maps.MapMouseEvent) => {
  //   if (event.latLng) {
  //     const newPoint = {
  //       lat: event.latLng.lat(),
  //       lng: event.latLng.lng(),
  //     };

  //     console.log("newPoint ", newPoint);

  //     if (mode === "route") {
  //       setRoutePoints((prevPoints) => [...prevPoints, newPoint]);
  //     } else {
  //       setAreaPoints((prevPoints) => {
  //         const updatedPoints = [...prevPoints, newPoint];
  //         console.log("Updated AreaPoints: ", updatedPoints);

  //         // בניית הפוליגון רק אם יש יותר מ-2 נקודות
  //         if (updatedPoints.length > 2) {
  //           const polygon = new google.maps.Polygon({
  //             paths: updatedPoints,
  //             fillColor: "yellow",
  //             fillOpacity: 0.1,
  //             strokeColor: "yellow",
  //             strokeOpacity: 0.8,
  //             strokeWeight: 2,
  //           });
  //           polygon.setMap(mapRef.current);
  //           console.log("Polygon: ", polygon);

  //           polygonRef.current = polygon;
  //         }

  //         return updatedPoints;
  //       });
  //     }
  //   }
  // };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPoint = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      if (mode === "route") {
        // אם הנקודה הראשונה נבחרה שוב
        if (
          routePoints.length >= 2 &&
          newPoint.lat === routePoints[0].lat &&
          newPoint.lng === routePoints[0].lng
        ) {
          if (!isFirstPointClicked) {
            // אם הנקודה הראשונה נבחרה מחדש
            setIsFirstPointClicked(true);
            // הוספת הנקודה הראשונה בסוף המסלול
            const updatedRoutePoints = [...routePoints, routePoints[0]]; // הוספת הנקודה הראשונה בסוף
            setRoutePoints(updatedRoutePoints);
            calculateRoute(updatedRoutePoints); // חישוב המסלול המעגלי
          }
        } else {
          // הוספת נקודה חדשה למסלול
          setRoutePoints((prevPoints) => [...prevPoints, newPoint]);
        }
      } else {
        // הוספת נקודה לאזור
        setAreaPoints((prevPoints) => {
          const updatedPoints = sortPointsByProximity([
            ...prevPoints,
            newPoint,
          ]);
          return updatedPoints;
        });
      }
    }
  };

  const sortPointsByProximity = (points: google.maps.LatLngLiteral[]) => {
    if (points.length <= 2) return points;

    const sortedPoints = [points[0]];
    const remainingPoints = points.slice(1);

    while (remainingPoints.length) {
      const lastPoint = sortedPoints[sortedPoints.length - 1];
      let closestIndex = 0;
      let closestDistance =
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(lastPoint),
          new google.maps.LatLng(remainingPoints[0])
        );

      remainingPoints.forEach((point, index) => {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(lastPoint),
          new google.maps.LatLng(point)
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      sortedPoints.push(remainingPoints.splice(closestIndex, 1)[0]);
    }

    return sortedPoints;
  };

  const calculateRoute = (points: google.maps.LatLngLiteral[]) => {
    if (points.length < 2) {
      alert("עליך לבחור לפחות שתי נקודות למסלול.");
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const updatedPoints = isCircular ? [...points, points[0]] : points; // אם מעגלי, נוסיף את הנקודה הראשונה בסוף.

    const request: google.maps.DirectionsRequest = {
      origin: updatedPoints[0], // נקודת התחלה
      destination: updatedPoints[updatedPoints.length - 1], // יעד מסלול
      waypoints: updatedPoints.slice(1, updatedPoints.length - 1).map((point) => ({
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

    // אם יש פוליגון שמור, נסיר אותו מהמפה
    if (polygonRef.current) {
      polygonRef.current.setMap(null); // מסיר את הפוליגון מהמפה
      polygonRef.current = null; // מאפס את ה-referene
    }
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
          onClick={() => {
            setIsCircular(false);
            calculateRoute(routePoints);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          חישוב מסלול רגיל
        </button>
        <button
          onClick={() => {
            setIsCircular(true);
            calculateRoute(routePoints);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          חישוב מסלול מעגלי
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
