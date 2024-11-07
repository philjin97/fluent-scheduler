import Navigation from "@/components/navigation";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const inter = Noto_Sans_KR({
  subsets: ["latin"],
});

export const metadata = {
  title: "Fluent",
  description: "학원 서비스 폼",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="{inter.className} w-full min-h-[100vh] bg-white">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
