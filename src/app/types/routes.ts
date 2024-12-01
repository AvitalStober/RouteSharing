import { Types } from "mongoose";

export default interface Routes {
  ownerId: Types.ObjectId;
  pointsArray: [google.maps.LatLngLiteral];
  // walkingTime: number;
}
