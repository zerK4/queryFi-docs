import { ModeToggle } from "@/components/theme-toggle";
import { GithubIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Search from "./search";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { page_routes } from "@/lib/routes-config";
import Image from "next/image";

export const NAVLINKS = [
  {
    title: "Documentation",
    href: `/docs${page_routes[0].href}`,
  },
  {
    title: "Blog",
    href: "/blog",
  },
];

export function Navbar() {
  return (
    <nav className='sticky top-0 z-50 w-full h-16 border-b bg-background'>
      <div className='sm:container mx-auto w-[95vw] h-full flex items-center justify-between md:gap-2'>
        <div className='flex items-center gap-5'>
          <SheetLeftbar />
          <div className='flex items-center gap-6'>
            <div className='hidden sm:flex'>
              <Logo />
            </div>
            <div className='items-center hidden gap-4 text-sm font-medium lg:flex text-muted-foreground'>
              <NavMenu />
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <Search />
            <div className='flex ml-2.5 sm:ml-0'>
              <Link
                href='https://github.com/zerK4/queryfi-ts'
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <GithubIcon className='h-[1.1rem] w-[1.1rem]' />
              </Link>
              <Link
                href='https://x.com/s_pav3l'
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
              >
                <TwitterIcon className='h-[1.1rem] w-[1.1rem]' />
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <Link href='/' className='flex items-center gap-2.5'>
      <h2 className={cn("text-md font-bold font-code flex items-center gap-2")}>
        <Image src={"/logo.png"} alt='queryFi logo' height={30} width={30} />{" "}
        queryfi
      </h2>
    </Link>
  );
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName='!text-primary dark:font-medium font-semibold'
            absolute
            className='flex items-center gap-2 dark:text-stone-300/85 text-stone-800'
            href={item.href}
          >
            {item.title}
          </Anchor>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}
