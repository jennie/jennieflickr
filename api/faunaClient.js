// /api/faunaClient.js
import { Client } from "fauna";

export const createFaunaClient = (faunaSecret) => {
  return new Client({
    secret: faunaSecret,
  });
};
