import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "ZEB-Construction Managemant", description: "Building Better Spaces for a Stronger Tomorrow" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
