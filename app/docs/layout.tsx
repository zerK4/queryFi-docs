import { Leftbar } from "@/components/leftbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex items-start gap-8'>
      <Leftbar key='leftbar' />
      <div className='flex-[5.25]'>
        <TooltipProvider>{children}</TooltipProvider>
      </div>
    </div>
  );
}
