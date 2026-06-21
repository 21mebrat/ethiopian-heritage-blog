import { AppProvider } from "./context/ui-context";
import { BlogProvider } from "./context/blog-context";

import "./globals.css";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <BlogProvider>
        <html lang="en">
          <body className={`${geist.className} bg-background text-foreground`}>
            {children}
          </body>
        </html>
      </BlogProvider>
    </AppProvider>
  );
}