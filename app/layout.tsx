import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Rumina Creations | Boutique Crochet",
  description: "Modern Studio aesthetic boutique crochet brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <header className="site-header">
          <nav className="nav-container">
            <Link href="/" className="logo">
              Rumina Creations
            </Link>
            <div className="nav-links">
              <Link href="/">Catalogue</Link>
              <Link href="/admin">Portal</Link>
            </div>
          </nav>
        </header>
        <main className="main-content">
          {children}
        </main>
        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} Rumina Creations. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
