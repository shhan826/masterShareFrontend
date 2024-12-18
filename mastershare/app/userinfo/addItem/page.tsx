'use client'

import Image from "next/image";
import { redirect } from 'next/navigation'
import { useState, useRef } from "react";

export default function AddItem ()
{
    const ref = useRef<HTMLTextAreaElement>(null);
    const sampleIndex = Math.floor(Math.random() * 6);
    const sampleString = [
        '좋은 인연을 만나게 될 지도?',
        '고민하고 있던 일들이 곧 풀릴 예정',
        '한 해 내내 잔병치레 없는 건강',
        '베풀면 배로 돌아올 것',
        '예상치 못한 수익이 들어옴',
        '좋은 운이 있어, 소중히 사용할 것'
    ];

    const onTextLengthHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const length = e.target.value.length;
        const target = ref.current;
        if (target === null) return;
        if (length < 30) {
            target.style.fontSize = "1.25rem";
        } else if (length < 60) {
            target.style.fontSize = "1rem";
        } else {
            target.style.fontSize = "0.75rem";
        }
    };

    // 서버 API 제작 대기 중
    const createCookie = () => {
        alert('구현 중');
        history.back();
    };

    return(
        <div>
            <div className='absolute w-full h-full flex flex-col justify-center items-center'>
                <Image
                    aria-hidden
                    src="/mainImage.png"
                    alt="main image"
                    width={400}
                    height={400}
                />
            </div>
            <div className='absolute flex flex-col justify-center items-center w-full h-screen z-1'>
                <div className='bg-white w-5/6 h-16 flex flex-col justify-center rounded-md shadow-xl'>
                    <textarea 
                        ref={ref}
                        className="text-center resize-none w-full outline-none h-7 text-lg" 
                        maxLength={80} placeholder={sampleString[sampleIndex]} 
                        onChange={onTextLengthHandler}>
                    </textarea> 
                </div>
                <br/>
                <button className='mx-3 btn btn-secondary' onClick={createCookie}>만들기</button>
            </div>
        </div>
    );
}