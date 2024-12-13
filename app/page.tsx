"use client";

import CodeShowcase from "@/components/codeShowcase";
import Hero from "@/components/hero";
// import { createQuery } from "@/lib/queryBuilder";
// import { IUser } from "@/types/user";
// import { useEffect } from "react";

export default function Home() {
  // useEffect(() => {
  //   const query = createQuery<IUser>("/api/api/users", {
  //     baseUrl: process.env.NEXT_PUBLIC_PLAYGROUND_URL,
  //     transformer: (params) => ({
  //       ...params,
  //       "token": "asdadsa",
  //     }),
  //   })
  //     .with("posts")
  //     .where([["id", "whereBetween", [10, 30]]])
  //     .paginate(3, 4)
  //     .get();

  //   fetch(query).then(async (res) => console.log(await res.json(), query));
  // }, []);
  return (
    <div className='relative flex overflow-x-hidden sm:min-h-[85.5vh] w-full gap-4 min-h-[85vh] flex-col justify-center lg:items-center text-center px-2 sm:py-8 py-12'>
      <div className='fixed -top-[0vh] lg:flex hidden border-l border-dashed h-0 left-[7rem] anime-hero-dashed-v-line border-neutral-900 dark:border-white' />
      <Hero />
      <CodeShowcase />
    </div>
  );
}
