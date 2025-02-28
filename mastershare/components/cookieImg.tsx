'use client'

import Image from "next/image";
import { redirect } from 'next/navigation'
import { CookieContent, MsgUpdateResult, RefreshTokenResult } from "@/lib/type";
import { updateMessageAPI, refreshTokenAPI, handleRefreshTokenFail, handleRefreshTokenSuccess } from "@/lib/util";
import { useEffect, useState } from "react";
import { TAB } from "@/lib/constant";
import { East_Sea_Dokdo } from 'next/font/google'

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

interface ImgProps {
    cookieData: CookieContent,
    size: number,
    pageId: string | null
}

export default function CookieImg (props: ImgProps)
{
    const {cookieData, pageId} = props;

    const [isClient, setIsClient] = useState(false);

    const title = cookieData.title;
    const isOpen = cookieData.opened;
    const msgId = cookieData.messageId;
    const isPublic = cookieData.isPublic;
    const link = '/userinfo/revealItem?msgid=' + msgId + '&pageId=' + pageId + '&tab=' + TAB.RECEIVED;

    let accessToken = '';
    let refreshToken = '';
    let userId = '';
    if (isClient) {
        accessToken = localStorage.getItem('accessToken') || '';
        refreshToken = localStorage.getItem('refreshToken') || '';
        userId = localStorage.getItem("userId") || '';
    }
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const openMessage = () => {
        if (msgId === -1) redirect(link);
        if (isOpen === true) {
            if (isPublic || (userId === pageId)) {
                redirect(link);
            } else {
                alert('해당 쿠키는 받은 사람만 확인할 수 있습니다.');
            }
            return;
        }
        if (userId !== pageId) {
            alert('아직 열리지 않은 쿠키는 받은 사람만 확인할 수 있습니다.');
            return;
        } 
        updateMessageAPI(msgId, accessToken, { opened: true })
        .then((result) => handleOpenMessage(result));
    };
    const handleOpenMessage = (result: MsgUpdateResult) => {
        if (result.success === false && result.error.code === 401) {
            refreshTokenAPI(accessToken, refreshToken)
            .then((result) => handleRefreshTokenOnOpenMessage(result));
        } else if (result.success === true) {
            redirect(link);
        } 
    };
    const handleRefreshTokenOnOpenMessage = (result: RefreshTokenResult) => {
        if (result.success) {
            const newAccessToken = handleRefreshTokenSuccess(result);
            updateMessageAPI(msgId, newAccessToken, { opened: true })
            .then((result) => {
                if (result.success) {
                    redirect(link);
                } else {
                    alert('잘못된 접근입니다.');
                }
            });
        } else {
            handleRefreshTokenFail();
        }
    };
    const animate = (event: React.MouseEvent<HTMLDivElement>) => {
        const targetChild = event.target;
        const target = (targetChild as Element).parentElement;
        if (target && target.className === 'animateTarget') {
            target.className = 'rotate_animation';
            setTimeout(() => {
                target.className = 'animateTarget';
            }, 3000);
        }
    };

    if (props.cookieData === undefined || pageId === null) {
        return <></>;
    }
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
                    <div className="text-black bg-white rounded-md shadow-xl"><span className={dokdoFont.className}>{title}</span></div>
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