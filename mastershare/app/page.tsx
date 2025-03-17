'use client'

import Image from "next/image";
import Link from 'next/link';
import koTranslation from '../locales/ko/common.json';
import enTranslation from '../locales/en/common.json';
import { useEffect, useState } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [translation, setTranslation] = useState(koTranslation);
  let lang = '';
  if (isClient) {
    lang = localStorage.getItem('lang') || window.navigator.language || '';
  }

  const changeLang = () => {
    if (lang === 'ko' || lang === 'ko-KR') {
      setTranslation(enTranslation);
      localStorage.setItem('lang', 'en');
    } else {
      setTranslation(koTranslation);
      localStorage.setItem('lang', 'ko');
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (lang === 'ko' || lang === 'ko-KR') {
      setTranslation(koTranslation);
    } else {
      setTranslation(enTranslation);
    }
  }, [lang]);

  return (
    <div>
      <div className="fixed top-0 left-0 w-full">
        <div className="text-gray-400 m-3 text-sm cursor-pointer" onClick={changeLang}>{lang === 'ko' || lang === 'ko-KR' ? 'English' : '한국어'}</div>
      </div>
      <div className="grid grid-rows-[80px_1fr_20px] items-center justify-items-center min-h-dvh p-9 pb-20 gap-10">
        <header className="row-start-1 flex gap-6 flex-wrap pt-3 items-center justify-center text-center">
          <p>{translation.main["title-1"]}<br/>{translation.main["title-2"]}</p>
        </header>
        <main className="flex flex-col gap-5 row-start-2 items-center">
          <div className="rotate_animation">
            <Link href="/userinfo/revealItem?pageId=random">
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
              <Link href="/userinfo/revealItem?pageId=random"><button type="button" className="btn btn-warning">{translation.main["get-random"]}</button></Link>
              <Link href="/userinfo/addItem?pageId=random"><button type="button" className="btn btn-secondary">{translation.main["make-random"]}</button></Link>
            </div>
            <div className="flex items-center justify-center">
              <Link href="/login"><button type="button" className="btn btn-link btn-sm">{translation.main["my-list"]}</button></Link>
            </div>
        </footer>
      </div>
    </div>
  );
}
