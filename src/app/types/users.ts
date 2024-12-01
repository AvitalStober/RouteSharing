import { Types } from "mongoose";

export default interface User{
    fullName:string;
    password:string;
    email:string;
    age:number;
    address:string;
    historyRoutes:[Types.ObjectId];
    // ownerRoutes:[Types.ObjectId];
}