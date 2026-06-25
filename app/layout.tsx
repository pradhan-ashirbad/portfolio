import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl = "https://ashirbad-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ashirbad Pradhan — Full-Stack Developer",
  description:
    "Computer Science student & developer building interactive web apps, AI-powered tools, and data-driven experiences. Explore my projects and skills.",
  keywords: [
    "Ashirbad Pradhan",
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "Portfolio",
    "Power BI",
  ],
  authors: [{ name: "Ashirbad Pradhan" }],
  openGraph: {
    title: "Ashirbad Pradhan — Full-Stack Developer",
    description:
      "Interactive web apps, AI-powered tools, and data-driven experiences.",
    url: siteUrl,
    siteName: "Ashirbad Pradhan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashirbad Pradhan — Full-Stack Developer",
    description:
      "Interactive web apps, AI-powered tools, and data-driven experiences.",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#07090f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
