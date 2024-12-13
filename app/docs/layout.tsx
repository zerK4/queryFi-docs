import { Leftbar } from "@/components/leftbar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex sm:container mx-auto w-[90vw] items-start gap-8'>
      <Leftbar key='leftbar' />
      <div className='flex-[5.25]'>{children}</div>
    </div>
  );
}
