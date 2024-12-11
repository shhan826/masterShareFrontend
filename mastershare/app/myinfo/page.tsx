'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link'

export default function MyInfo() {
    const [loginId, setLoginId] = useState('회원');
    useEffect(() => {
        const url = new URL(window.location.href);
        const urlParam = url.searchParams.get('id');
        if (urlParam) setLoginId(urlParam);
    })
    // TODO: get member data from server by login id
    
    return(
        <div className="grid grid-rows-[80px_1fr_20px] items-center justify-items-center min-h-screen p-9 pb-20 gap-10">
            <header className="row-start-1 gap-6 items-center justify-center text-center">
                <p>{loginId}님, 안녕하세요!</p>
            </header>
            <main className="flex flex-col gap-5 row-start-2 items-center">
               <div className="slidein">
                    <Image
                    aria-hidden
                    src="/mainImage.jpg"
                    alt="main image"
                    width={300}
                    height={300}
                    />
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <button type="button" className="btn btn-outline-secondary">오늘의 쿠키 열어보기</button>
            </footer>
        </div>
    );
}