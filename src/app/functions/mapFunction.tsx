export const handleMapClick = (
  event: google.maps.MapMouseEvent,
  mode: "route" | "area",
  routePoints: google.maps.LatLngLiteral[],
  setRoutePoints: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral[]>
  >,
  setAreaPoints: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral[]>
  >,
  isFirstPointClicked: boolean,
  setIsFirstPointClicked: React.Dispatch<React.SetStateAction<boolean>>,
  calculateRoute: (points: google.maps.LatLngLiteral[]) => void
) => {
  if (event.latLng) {
    const newPoint = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    if (mode === "route") {
      if (
        routePoints.length >= 2 &&
        newPoint.lat === routePoints[0].lat &&
        newPoint.lng === routePoints[0].lng
      ) {
        if (!isFirstPointClicked) {
          setIsFirstPointClicked(true);
          const updatedRoutePoints = [...routePoints, routePoints[0]];
          setRoutePoints(updatedRoutePoints);
          calculateRoute(updatedRoutePoints);
        }
      } else {
        setRoutePoints((prevPoints) => [...prevPoints, newPoint]);
      }
    } else {
      setAreaPoints((prevPoints) => {
        const updatedPoints = sortPointsByProximity([...prevPoints, newPoint]);
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
    let closestDistance = google.maps.geometry.spherical.computeDistanceBetween(
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

