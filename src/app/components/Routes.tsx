"use client";
import React, { useEffect, useState } from "react";
import { getRoutesByOwner } from "@/app/services/routeService";
import Route from "@/app/types/routes";
import RouteCard from "./RouteCard";

const Routes = () => {
  const [ownerRoutes, setOwnerRoutes] = useState<Route[]>([]); // עדכון לסוג מערך של Routes

  useEffect(() => {
    const fetchUserRoutes = async () => {
      try {
        const userId = "6748432c55a7b151ad833d81"; // ID של המשתמש
        const ownerR = await getRoutesByOwner(userId);
        setOwnerRoutes(ownerR);
      } catch (error) {
        console.error("Error fetching user routes:", error);
      }
    };

    fetchUserRoutes();
  }, []);

  return (
    <div>
      <RouteCard ownerRoutes={ownerRoutes} />

    </div>
  );
};

export default Routes;
