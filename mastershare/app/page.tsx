import Image from "next/image";
import Link from 'next/link'
import Sharedialog from "./components/sharedialog";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image
            aria-hidden
            src="/mainImage.jpg"
            alt="main image"
            width={200}
            height={200}
        />
        <ol className="list-inside list-decimal text-center">
          이곳은 플레이그라운드 페이지입니다.
        </ol>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Link 
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/share"
        >
          <Image
            className="inline-block"
            aria-hidden
            src="/share.svg"
            alt="share icon"
            width={16}
            height={16}
          />
          공유하기
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/myinfo"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="my page icon"
            width={16}
            height={16}
          />
          내 페이지
        </Link>
      </footer>
    </div>
  );
}
