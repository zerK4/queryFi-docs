"use server";

import { createQuery } from "@/lib/queryBuilder";
import axios from "axios";

export const runQueryAction = async (type: "get" | "first") => {
  try {
    const query = createQuery("/api/users")
      .with(["posts"])
      .where({
        id: 50,
      })
      [type]();

    const url = process.env.PLAYGROUND_URL + query;
    const { data } = await axios.get(url);

    return data;
  } catch (err) {
    console.log(err, "oops, an error occured");

    throw err;
  }
};
