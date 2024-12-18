'use client'

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CookieImg from "./cookieImg";

interface CookieListProps {
    isRevealPossible: boolean;
}

export default function CookieList (props: CookieListProps)
{
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    
    const imgSize = 160;
    // 서버에서 받아와야 하는 데이터
    const cookieArray1 = ['근하신년', '가화만사성'];
    const cookieArray2 = ['남녀칠세..', '새해복많이', '뾲뾲이'];
    const cookieArray3 = ['이편지를..', '죽은자의..'];

    // 사이즈 파악 용도. 현재 사용 안함. 추후 사용할 수 있어 남겨둠
    useEffect(() => {
        const elem = ref.current;
        if (elem) {
            const rect = elem.getBoundingClientRect();
            setHeight(rect.height);
            setWidth(rect.width);
        }
    }, [ref])

    return(
        // Carousel 사용해서 페이지 넘기기 기능 추가 필요
        <div ref={ref} className="w-full h-full flex flex-col gap-1 justify-center">
            <div className="flex justify-center">
                {cookieArray1.map((cookie) => (      
                    <CookieImg key={cookie} isRevealPossible={props.isRevealPossible} subject={cookie.toString()} size={imgSize}/>
                ))}
            </div>
            <div className="flex justify-center">
                {cookieArray2.map((cookie) => (      
                    <CookieImg key={cookie} isRevealPossible={props.isRevealPossible} subject={cookie.toString()} size={imgSize}/>
                ))}
            </div>
            <div className="flex justify-center">
                {cookieArray3.map((cookie) => (      
                    <CookieImg key={cookie} isRevealPossible={props.isRevealPossible} subject={cookie.toString()} size={imgSize}/>
                ))}
            </div>
        </div>
    );
}