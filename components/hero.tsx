"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { CommandIcon } from "lucide-react";
import { useEffect } from "react";
import anime from "animejs";
import { leavingPage } from "@/lib/utils";

function Hero() {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "d") {
        event.preventDefault();
        window.location.href = "/docs/installation";
      }

      if ((event.metaKey || event.ctrlKey) && event.key === "g") {
        event.preventDefault();
        leavingPage("https://github.com/zerK4/queryfi-ts");
      }
    };
    window.addEventListener("keydown", listener);

    const tl = anime.timeline({});
    tl.add(
      {
        targets: ".anime-hero-dashed-h-line",
        opacity: [1, 0.4],
        width: "200vw",
        duration: 1500,
        easing: "easeInOutExpo",
        delay: anime.stagger(100),
      },
      "-=600"
    ).add(
      {
        targets: ".anime-hero-dashed-v-line",
        opacity: [1, 0.4],
        height: "100%",
        duration: 1000,
        easing: "easeInOutExpo",
        delay: anime.stagger(200),
      },
      "-=1200"
    );

    return () => window.removeEventListener("keydown", listener);
  }, []);
  return (
    <div className='sm:container mx-auto w-[90vw] lg:h-[22rem] flex items-start justify-start gap-10 flex-col relative'>
      <div className='absolute lg:flex hidden -left-[40vw] border-t border-dashed top-[10.65rem] w-0 anime-hero-dashed-h-line dark:border-white border-neutral-900' />
      <h1 className='!text-5xl lg:!text-[10rem] dark:text-neutral-300 text-neutral-800'>
        queryFi
      </h1>
      <div className='flex flex-col justify-start gap-4 px-3'>
        <p className='text-start lg:!text-2xl dark:text-neutral-300 text-neutral-800'>
          Put your queries to work!
        </p>
        <div className='flex justify-start w-full'>
          <Link
            href='/docs/installation'
            className={buttonVariants({
              variant: "ghost",
              className: "h-14 justify-start flex items-center gap-2",
            })}
          >
            <span
              className={buttonVariants({
                size: "icon",
                variant: "outline",
                className: "flex items-center justify-center",
              })}
            >
              <CommandIcon size={12} /> D
            </span>
            Read the docs
          </Link>
          <Link
            onClick={() => leavingPage("https://github.com/zerK4/queryfi-ts")}
            href='#'
            className={buttonVariants({
              variant: "ghost",
              className: "h-14 justify-start flex items-center gap-2",
            })}
          >
            <span
              className={buttonVariants({
                size: "icon",
                variant: "outline",
                className: "flex items-center justify-center",
              })}
            >
              <CommandIcon size={12} /> G
            </span>
            Github
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
