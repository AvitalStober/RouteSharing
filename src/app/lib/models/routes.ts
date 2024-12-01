import Route from "@/app/types/routes";
import mongoose, { Model, Schema } from "mongoose";

const LatLngLiteralSchema: Schema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const RoutesSchema: Schema<Route> = new Schema({
  ownerId: { type: Schema.Types.ObjectId, required: true },
  pointsArray: { type: [LatLngLiteralSchema], required: true },
  // walkingTime: { type: Number, required: true },
});

const Routes: Model<Route> =
  mongoose.models.routes || mongoose.model("routes", RoutesSchema);

export default Routes;
