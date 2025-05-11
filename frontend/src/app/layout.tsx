"use client";

import Navbar from "./navbar/page"; // Import the Navbar component
import "./globals.css"; // Import global styles (if any)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Navbar /> {/* Common Navbar */}
        <main>{children}</main> {/* Render the page content */}
      </body>
    </html>
  );
}