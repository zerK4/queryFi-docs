import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className='w-full h-16 border-t'>
      <div className='container flex flex-wrap items-center justify-center h-full gap-4 py-3 text-sm sm:justify-between sm:gap-0 text-muted-foreground sm:py-0 max-sm:px-4'>
        <div className='flex items-center gap-3'>queryfi</div>
        <div className='text-center flex items-center gap-2'>
          <Link
            className='px-1 underline underline-offset-2'
            href='https://github.com/nisabmohd/Aria-Docs'
          >
            AriaDocs
          </Link>
          optimized for
          <Image src={"/logo.png"} alt='queryFi logo' height={30} width={30} />
        </div>
      </div>
    </footer>
  );
}
