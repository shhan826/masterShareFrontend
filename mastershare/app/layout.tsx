import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const pretendard = localFont({
  src: "./fonts/Pretendard-Medium.woff",
  display: 'swap',
})

// SEO 등을 위한 메타데이터 제공
export const metadata: Metadata = {
  title: "Master Share",
  description: "Share anything you're interested in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body
        className={`${pretendard.className} ${pretendard.className} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
