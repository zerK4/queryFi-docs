import type { Metadata } from "next";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { Navbar } from "@/components/navbar";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import "@/styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const GeistSans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
});

const GeistMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "queryfi",
  metadataBase: new URL("https://queryfi.link"),
  description:
    "QueryFi is a powerful and flexible query builder designed for modern web applications. It simplifies crafting API queries with intuitive methods for filtering, sorting, pagination, relationships and more. With type-safe support, customizable query parameters, and seamless integration, QueryFi streamlines backend communication while keeping your code clean and maintainable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-regular antialiased tracking-wide`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <Navbar />
            <main className='h-auto scroll-smooth'>
              {children}
              <div className='fixed bottom-0 left-0 z-50 flex items-center justify-center w-full h-0 font-medium leaving text-foreground bg-background' />
            </main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
