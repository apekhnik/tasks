import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taskroulette",
  description: "Task management with random task picker",
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
