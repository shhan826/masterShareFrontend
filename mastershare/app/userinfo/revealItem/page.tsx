'use client'

import Image from "next/image";
import Link from 'next/link'
import { East_Sea_Dokdo } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import { redirect, useSearchParams } from 'next/navigation'
import CloseX from "@/components/closeX";
import { MsgUpdateResult, MsgRevealResult, RefreshTokenResult } from "@/lib/type";
import { updateMessageAPI, getMessageAPI, refreshTokenAPI } from "@/lib/util";

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

export default function RevealItem () {
    const msgBoxRef = useRef<HTMLDivElement>(null);

    const [messageString, setMessageString] = useState('');
    const [writerNickName, setWriterNickName] = useState('');

    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);

    let accessToken = '';
    let refreshToken = '';
    let userId = '';
    if (isClient) {
        accessToken = localStorage.getItem('accessToken') || '';
        refreshToken = localStorage.getItem('refreshToken') || '';
        userId = localStorage.getItem("userId") || '';
    }
    const pageId = searchParams.get('pageid');
    const msgId = searchParams.get('msgid');
    const isMyPage = (userId === pageId);
    const backURL = pageId === 'random' ? '/' : '/userinfo?pageid=' + pageId;

    const onShareMessage = async () => {
        navigator.clipboard.writeText(window.location.href);
        alert('현재 열린 쿠키의 주소가 복사되었습니다. 친구들과 공유해보세요!');
    };
    const onDeleteMessage = () => {
        if (msgId === null) return null;
        if (msgId === '-1') {
            alert('삭제할 수 없는 내용입니다.');
            return;
        }
        if (confirm("삭제된 쿠키는 복원할 수 없습니다. 해당 쿠키를 정말로 삭제하시겠습니까?") === false) {
            return;
        }
        updateMessageAPI(msgId, accessToken, { deleted: true })
        .then((result) => handleMsgDelete(result));
    };
    const handleMsgDelete = (result: MsgUpdateResult) => {
        if (result.success === false && result.error.code === 401) {
            refreshTokenAPI(accessToken, refreshToken)
            .then((result) => handleRefreshTokenOnMsgDelete(result));
        } else if (result.success === true) {
            redirect(backURL);
        } 
    };
    const handleRefreshTokenOnMsgDelete = (result: RefreshTokenResult) => {
        if (msgId === null) return;
        if (result.success) {
            const newAccessToken = result.data.accessToken;
            const newRefreshToken = result.data.refreshToken;
            if (isClient) {
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
            }
            updateMessageAPI(msgId, newAccessToken, { deleted: true })
            .then((result) => {
                if (result.success) {
                    redirect(backURL);
                } else {
                    alert('잘못된 접근입니다.');
                }
            });
        } else {
            alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
            if (isClient) {
                localStorage.removeItem("userId");
                localStorage.removeItem("nickName");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
            redirect('/login');
        }
    };
    const handleMsgReveal = (result: MsgRevealResult) => {
        if (result?.data === undefined) return;
        setMessageString(result.data.content);
        setWriterNickName(result.data.sender);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        setTimeout(() => {
            const msgBox = msgBoxRef.current;
            if (msgBox) {
                msgBox.style.opacity = '1';
                msgBox.style.transition = '0.8s';
            }
        }, 1600)
    }, [msgBoxRef]);
    useEffect(() => {
        // TODO: random message open
        if (pageId === 'random') {
            setMessageString('랜덤 메시지 예시입니다.');
            setWriterNickName('관리자');
            return;
        }
        
        if (msgId === null) return;
        if (msgId === '-1') {
            setMessageString('새해 복 많이 받으세요!');
            setWriterNickName('관리자');
        } else if (msgId !== '') {
            getMessageAPI(msgId, accessToken)
            .then((result) => handleMsgReveal(result));
        }
    }, [msgId, accessToken])

    // 처음 열 때는 클릭해서 쿠키를 부수는 게임적인 요소 추가하면 재미있을듯
    return(
        <div>
            <div className='absolute w-full text-right z-2'>
                <CloseX backURL={backURL}/>
            </div>
            <div className='absolute w-full h-dvh flex flex-col justify-center items-center'>
                <div className='tremble_animation'>
                    <Image
                        src="/mainImage.png"
                        alt="main image"
                        width={300}
                        height={300}
                    />
                </div>
                <div className='z-2'>
                    <br/>
                    <div className="hidden">
                        <button className='mx-2 btn btn-warning' onClick={onShareMessage}>
                            <Image
                                src="/share.svg"
                                alt="share"
                                width={20}
                                height={20}
                                className="inline-block"
                            />
                            <span>&nbsp;&nbsp;공유하기</span>
                        </button>
                    </div>
                    { pageId !== 'random' &&
                        <Link href={backURL}>
                            <button className='mx-2 btn btn-warning'>
                                <span>🍪&nbsp;&nbsp;쿠키 목록</span>
                            </button>
                        </Link>
                    }
                    { isMyPage && 
                        <button className='mx-2 btn btn-light' onClick={onDeleteMessage}>
                            <Image
                                src="/delete.svg"
                                alt="delete"
                                width={20}
                                height={20}
                                className="inline-block"
                            />
                            <span>&nbsp;&nbsp;버리기</span>
                        </button>
                    }
                </div>
            </div>
            <div ref={msgBoxRef} className='absolute flex flex-col justify-center items-center w-full h-dvh z-1' style={{opacity: 0}}>
                <div className='bg-white w-5/6 flex flex-col justify-center rounded-md shadow-xl p-3'>
                    <div className="text-center text-3xl leading-7 break-keep">
                        <span className={dokdoFont.className}>{messageString}</span>
                    </div> 
                </div>
                <p className='w-5/6 text-sm text-slate-600 text-right mt-2'>- {writerNickName}</p>
            </div>
        </div>
    );
}