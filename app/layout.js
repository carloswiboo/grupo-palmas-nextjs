import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap-grid.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GFF - Donations",
  description: "Your donation helps us greatly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
