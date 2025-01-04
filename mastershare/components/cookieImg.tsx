'use client'

import { cookieData } from "@/app/userinfo/page";
import { MsgRevealResult } from "@/app/userinfo/revealItem/page";
import Image from "next/image";
import Link from 'next/link'
import { East_Sea_Dokdo } from 'next/font/google'

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

interface ImgProps {
    cookieData: cookieData,
    size: number,
    isRevealPossible: boolean,
}

export default function CookieImg (props: ImgProps)
{
    if (props.cookieData === undefined) {
        return <></>;
    }
    const title = props.cookieData.title;
    const msgId = props.cookieData.messageId
    const link = props.isRevealPossible ? '/userinfo/revealItem?id=' + msgId : '';
    const msgOpen = () => {
        const url = "/boards/v1/message/open/" + msgId;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            })
            .then((response) => response.json())
            .then((result) => onOpenMsg(result));
    };
    const onOpenMsg = (result: MsgRevealResult) => {
        if (result === undefined) {
            console.log('message open error');
        }
    }
    const animate = (event: any) => {
        const target = event.target.parentElement;
        if (target.className === 'animateTarget') {
            target.className = 'rotate_animation';
            setTimeout(() => {
                target.className = 'animateTarget';
            }, 3000);
        }
    };
    return(
        <Link href={link} className="relative" onClick={msgOpen}>
            <div className='animateTarget' onMouseOver={animate}>    
                <Image
                    key={title}
                    src="/mainImage.png"
                    alt="main image"
                    width={props.size}
                    height={props.size}
                />
                <div className="absolute left-1/2 top-1 text-black"><span className={dokdoFont.className}>{title}</span></div>
            </div>
        </Link>
    );
}