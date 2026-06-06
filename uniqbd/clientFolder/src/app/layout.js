import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/HomePage/Navbar";
import Footer from "./components/Footer/Footer";
import { ThemeProvider } from "next-themes";
import BubbleRain from "./components/BubbleRain";
import { CartProvider } from "@/context/CartContext";
import { ThemeContextProvider } from "@/context/ThemeContext";
import Socialicones from "./Socialicones/page";
import SnakeBackground from "./components/SnakeBackground"; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UniQbd - Buy Game Top-Up & Gift Cards in Bangladesh",
  description:
    "Buy PUBG UC, Free Fire Diamonds, Steam Gift Cards in Bangladesh. Instant delivery with bKash, Nagad, Rocket.",
  keywords: [
    "PUBG UC Bangladesh",
    "Free Fire Diamonds BD",
    "Steam Gift Card BD",
    "Game Top Up Bangladesh",
  ],
  authors: [{ name: "UniQbd" }],
  creator: "UniQbd",
  openGraph: {
    title: "UniQbd Gaming Store",
    description: "Best place for game top-ups in Bangladesh",
    url: "https://yourdomain.com",
    siteName: "UniQbd",
   
    locale: "en_BD",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <ThemeContextProvider>
            <CartProvider>
              {/* <SnakeBackground/> */}
              <Navbar />
              <main className="relative min-h-screen overflow-hidden">
                <div className="relative z-5">
                
                  <div className="color">{children}</div>
                </div>
              
              </main>
              <Socialicones/>
              <Footer />
            </CartProvider>
          </ThemeContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
