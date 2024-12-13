import { PropsWithChildren } from "react";

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <div className='flex sm:container mx-auto w-[90vw] flex-col items-start justify-center pt-8 pb-10'>
      {children}
    </div>
  );
}
