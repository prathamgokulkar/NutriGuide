// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import SessionWrapper from "./components/SessionWrapper";

export const metadata = { 
  title: "NutriGuide",
  icons: {
    icon: "./public/favicon.png",
  }, };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <Navbar />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}