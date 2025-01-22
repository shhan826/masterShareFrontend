'use client'

import Image from "next/image";
import { redirect } from 'next/navigation'
import { East_Sea_Dokdo } from 'next/font/google'
import { CookieContent, MsgOpenResult, RefreshTokenResult } from "@/lib/type";
import { openMessageAPI, refreshTokenAPI } from "@/lib/util";

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
    if (props.cookieData === undefined || pageId === null) {
        return <></>;
    }
    const title = cookieData.title;
    const isOpen = cookieData.opened;
    const msgId = cookieData.messageKey;
    const link = '/userinfo/revealItem?msgid=' + msgId + '&pageid=' + pageId;

    let accessToken = '';
    let refreshToken = '';
    let userId = '';
    if (typeof window !== 'undefined') {
        accessToken = localStorage.getItem('accessToken') || '';
        refreshToken = localStorage.getItem('refreshToken') || '';
        userId = localStorage.getItem("userId") || '';
    }

    const openMessage = () => {
        if (msgId === '-1' || isOpen === true) {
            redirect(link);
            return;
        }
        if (userId !== pageId) {
            alert('아직 열리지 않은 쿠키는 받은 사람만 확인할 수 있습니다.');
            return;
        }
        openMessageAPI(msgId, accessToken)
        .then((result) => handleOpenMessage(result));
    };
    const handleOpenMessage = (result: MsgOpenResult) => {
        if (result.success === false && result.error.code === 401) {
            refreshTokenAPI(accessToken, refreshToken)
            .then((result) => handleRefreshTokenOnOpenMessage(result));
        } else if (result.success === true) {
            redirect(link);
        } 
    };
    const handleRefreshTokenOnOpenMessage = (result: RefreshTokenResult) => {
        if (result.success) {
            const newAccessToken = result.data.accessToken;
            const newRefreshToken = result.data.refreshToken;
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
            }
            openMessageAPI(msgId, newAccessToken)
            .then((result) => {
                if (result.success) {
                    redirect(link);
                } else {
                    alert('잘못된 접근입니다.');
                }
            });
        } else {
            alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
            if (typeof window !== 'undefined') {
                localStorage.removeItem("userId");
                localStorage.removeItem("nickName");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
            redirect('/login');
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