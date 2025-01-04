import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid grid-rows-[80px_1fr_20px] items-center justify-items-center min-h-screen p-9 pb-20 gap-10">
      <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center text-center">
        <p>친구들이 만들어준 <span className='font-bold text-lg'>포춘쿠키</span>로 <br/>올해 운세를 알아보세요!</p>
      </header>
      <main className="flex flex-col gap-5 row-start-2 items-center">
        <div className="rotate_animation">
          <Link href="/login">
            <Image
              src="/mainImage.png"
              alt="main image"
              width={400}
              height={400}
            />
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Link href="/login">
          <button type="button" className="btn btn-outline-secondary">내 쿠키 열어보기</button>
        </Link>
      </footer>
    </div>
  );
}
