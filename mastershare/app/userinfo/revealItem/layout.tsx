import type { Metadata } from "next";

const title = "포춘 쿠키";
const description = "친구가 공유한 쿠키를 확인해보세요!";
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
