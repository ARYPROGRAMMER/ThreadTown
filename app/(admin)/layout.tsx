import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thread Town Sanity Admin",
  description: "Freedom to Social Network Admin Panel",
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
