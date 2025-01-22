import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from "react";

const pretendard = localFont({
  src: "./fonts/Pretendard-Medium.woff",
  display: 'swap',
});

// SEO 등을 위한 메타데이터 제공
// TODO: 페이지마다 동적으로 다르게 제공하면 좋을 것 같음
const title = "포춘 쿠기";
const description = "친구들과 쿠키로 덕담을 나눠보세요.";
export const metadata: Metadata = {
  title: title,
  description: description,
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
    ]
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
