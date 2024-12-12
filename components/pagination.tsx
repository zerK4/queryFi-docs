import { getPreviousNext } from "@/lib/markdown";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function Pagination({ pathname }: { pathname: string }) {
  const res = getPreviousNext(pathname);

  return (
    <div className='grid grid-cols-2 flex-grow sm:py-10 py-7 gap-3'>
      <div>
        {res.prev && (
          <Link
            className={buttonVariants({
              variant: "outline",
              className:
                "no-underline w-full flex flex-col pl-3 !py-8 !items-start group/left-page",
            })}
            href={`/docs${res.prev.href}`}
          >
            <span className='flex items-center text-muted-foreground text-xs'>
              <ChevronLeftIcon
                size={16}
                className='mr-1 group-hover/left-page:-translate-x-2 transition-[transform] ease-linear duration-300'
              />
              Previous
            </span>
            <span className='mt-1 ml-1'>{res.prev.title}</span>
          </Link>
        )}
      </div>
      <div>
        {res.next && (
          <Link
            className={buttonVariants({
              variant: "outline",
              className:
                "no-underline w-full flex flex-col pr-3 !py-8 !items-end  group/right-page",
            })}
            href={`/docs${res.next.href}`}
          >
            <span className='flex items-center text-muted-foreground text-xs'>
              Next
              <ChevronRightIcon
                size={16}
                className='ml-1 group-hover/right-page:translate-x-2 transition-[transform] ease-linear duration-300'
              />
            </span>
            <span className='mt-1 mr-1'>{res.next.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
