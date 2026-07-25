import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://whunder.world"),
  title: "WhunderWorld | Terraria Fan Server",
  description:
    "WhunderWorld is a whimsical Terraria fan server and community, established in 2012.",
  applicationName: "WhunderWorld",
  openGraph: {
    title: "WhunderWorld | Adventure Since 2012",
    description: "A storybook Terraria fan server for builders, explorers, and boss hunters.",
    siteName: "WhunderWorld",
    type: "website",
    url: "https://whunder.world",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "WhunderWorld pixel-art landscape with rainbow gems and the words Adventuring Since 2012",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhunderWorld | Adventure Since 2012",
    description: "A storybook Terraria fan server for builders, explorers, and boss hunters.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#66c5e8" },
    { media: "(prefers-color-scheme: dark)", color: "#17264f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
