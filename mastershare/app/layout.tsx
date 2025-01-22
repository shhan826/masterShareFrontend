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
const description = "친구들과 쿠키로 덕담을 나눠보세요!";
export const metadata: Metadata = {
  title: title,
  description: description,
  metadataBase: new URL("https://lettergram.store"),
  openGraph: {
    title: title,
    description: description,
    url: 'https://lettergram.store',
  },
  twitter: {
    title: title,
    description: description
  }
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
