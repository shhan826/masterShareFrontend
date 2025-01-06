'use client'

import { cookieData } from "@/app/userinfo/page";
import Image from "next/image";
import { redirect } from 'next/navigation'
import { East_Sea_Dokdo } from 'next/font/google'

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

interface ImgProps {
    cookieData: cookieData,
    size: number,
    isRevealPossible: boolean,
    pageId: string
}
interface OpenMessageResult {
    messageId: string,
    sender: string,
    title: string,
    content: string,
    opened: boolean,
    createdAt: string
}

export default function CookieImg (props: ImgProps)
{
    const {cookieData, isRevealPossible, pageId} = props;
    if (props.cookieData === undefined) {
        return <></>;
    }
    const title = cookieData.title;
    const msgId = cookieData.messageId
    const link = isRevealPossible ? '/userinfo/revealItem?msgid=' + msgId + '&pageid=' + pageId : '';

    const accessToken = localStorage.getItem('accessToken') as string;

    const openMessage = () => {
        if (msgId === '-1') {
            redirect(link);
            return;
        }
        const fetchURL = "http://localhost:8080/boards/v1/message/open/" + msgId;
        fetch(fetchURL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            })
            .then((response) => response.json())
            .then((result) => handleOpenMessage(result));
    }
    const handleOpenMessage = (result: OpenMessageResult) => {
        redirect(link);
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
        <button className="relative" onClick={openMessage}>
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
        </button>
    );
}