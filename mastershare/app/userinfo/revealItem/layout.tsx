import type { Metadata } from "next";

// SEO 등을 위한 메타데이터 제공
const title = "포춘 쿠키";
const description = "친구가 공유한 쿠키를 확인해보세요!";
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

export default function RevealItemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        {children}
      </>
  );
}
