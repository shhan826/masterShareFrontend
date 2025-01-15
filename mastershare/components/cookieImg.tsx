'use client'

import Image from "next/image";
import { redirect } from 'next/navigation'
import { East_Sea_Dokdo } from 'next/font/google'
import { CookieContent, MsgOpenResult } from "@/lib/type";
import { openMessageAPI } from "@/lib/util";

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

interface ImgProps {
    cookieData: CookieContent,
    size: number,
    isRevealPossible: boolean,
    pageId: string
}

export default function CookieImg (props: ImgProps)
{
    const {cookieData, isRevealPossible, pageId} = props;
    if (props.cookieData === undefined) {
        return <></>;
    }
    const title = cookieData.title;
    const isOpen = cookieData.opened;
    const msgId = cookieData.messageId
    const link = isRevealPossible ? '/userinfo/revealItem?msgid=' + msgId + '&pageid=' + pageId : '/';

    const accessToken = localStorage.getItem('accessToken') as string;

    const openMessage = () => {
        if (msgId === '-1') {
            redirect(link);
            return;
        }
        openMessageAPI(msgId, accessToken)
        .then((result) => handleOpenMessage(result));
    }
    const handleOpenMessage = (result: MsgOpenResult) => {
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
            { isOpen ? (
                <div>    
                    <Image
                        key={title}
                        src="/opend_cookie.png"
                        alt="opend"
                        width={props.size}
                        height={props.size}
                    />
                    <div className="left-10 text-black rounded-md shadow-xl"><span className={dokdoFont.className}>{title}</span></div>
                </div>
            ) : (
                <div>
                    <div className='animateTarget' onMouseOver={animate}>    
                        <Image
                            key={title}
                            src="/mainImage.png"
                            alt="main image"
                            width={props.size}
                            height={props.size}
                        />
                    </div>
                    <div className="text-black bg-white rounded-md shadow-xl"><span className={dokdoFont.className}>{title}</span></div>
                </div>
            )}
        </button>
    );
}