import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from "react";

const pretendard = localFont({
  src: "./fonts/Pretendard-Medium.woff",
  display: 'swap',
});

const title = "포춘 쿠키";
const description = "친구에게 쿠키로 덕담을 남겨주세요!";
export const metadata: Metadata = {
  title: title,
  description: description,
  metadataBase: new URL("https://lettergram.store"),
  openGraph: {
    title: title,
    description: description,
    url: 'https://lettergram.store',
    images: [
      {
        url: '/thumbnail.png',
        alt: 'fortune cookie'
      }
    ]
  },
  twitter: {
    title: title,
    description: description,
    images: [
      {
        url: '/thumbnail.png',
        alt: 'fortune cookie'
      }
    ]  }
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
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
