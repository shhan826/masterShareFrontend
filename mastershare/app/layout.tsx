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
  title: "포춘 쿠키로 새해 복을 전하세요",
  description: "친구들과 포춘 쿠키를 공유하며 덕담을 나눠보세요!",
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
