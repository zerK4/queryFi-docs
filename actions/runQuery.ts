"use server";

import axios from "axios";
import { createQuery } from "queryfi";

export const runQueryAction = async (type: "get" | "first") => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_PLAYGROUND_URL}`;

    const query = createQuery("/api/users", {
      baseUrl,
    })
      .with(["posts"])
      .where({
        id: 50,
      })
      [type]();

    console.log(query, "the query");

    const { data } = await axios.get(query);

    return data;
  } catch (err) {
    console.log(err, "oops, an error occured");

    throw err;
  }
};
