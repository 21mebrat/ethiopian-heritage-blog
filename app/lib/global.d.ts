import mongoose from "mongoose";

declare global {
  var mongooseCache: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  } | undefined;
}

export {};