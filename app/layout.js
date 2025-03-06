import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import { LoadingProvider } from "@/context/LoadingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Suzuki Palmas",
  description: "Suzuki Palmas",
};

export default function RootLayout({ children }) {
  return (
    <html className="h-full bg-white" lang="en">
      <body className={`${inter.className} h-full`}>
        <LoadingProvider>{children}</LoadingProvider>
      </body>
    </html>
  );
}
