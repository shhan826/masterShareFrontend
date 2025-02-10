import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  // TODO: random cookie open api
  return (
    <div className="grid grid-rows-[80px_1fr_20px] items-center justify-items-center min-h-dvh p-9 pb-20 gap-10">
      <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center text-center">
        <p>다른 사람들이 만들어준 <span className='font-bold text-lg'>포춘쿠키</span>로 <br/>오늘의 운세를 알아보세요!</p>
      </header>
      <main className="flex flex-col gap-5 row-start-2 items-center">
        <div className="rotate_animation">
          <Link href="/userinfo/revealItem?pageid=random">
            <Image
              src="/mainImage.png"
              alt="main image"
              width={300}
              height={300}
            />
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex flex-col gap-3 items-center justify-center">
          <div className="flex flex-row gap-3">
            <Link href="/userinfo/revealItem?pageid=random"><button type="button" className="btn btn-warning">랜덤 쿠키 열기</button></Link>
            <Link href="/userinfo/addItem?pageid=random"><button type="button" className="btn btn-secondary">새 쿠키 만들기</button></Link>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/login"><button type="button" className="btn btn-link btn-sm">내 쿠키 목록</button></Link>
          </div>
      </footer>
    </div>
  );
}
