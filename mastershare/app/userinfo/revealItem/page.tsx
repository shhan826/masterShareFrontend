'use client'

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { redirect, useSearchParams } from 'next/navigation'
import CloseX from "@/components/closeX";
import { MsgUpdateResult, MsgRevealResult, RefreshTokenResult, CreateCookieInput, BoardResult } from "@/lib/type";
import { updateMessageAPI, getMessageAPI, refreshTokenAPI, getRandomMessageAPI, handleRefreshTokenSuccess, handleRefreshTokenFail, createMessageAPI, getBoardAPI, getMessageAPIGuest } from "@/lib/util";
import { East_Sea_Dokdo } from 'next/font/google'
import { clientOrigin } from "@/lib/constant";

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

export default function RevealItem () {
    // TODO: 처음 열 때는 클릭해서 쿠키를 부수는 게임적인 요소 추가하면 재미있을듯
    const msgBoxRef = useRef<HTMLDivElement>(null);

    const [messageString, setMessageString] = useState('');
    const [writerNickName, setWriterNickName] = useState('');
    const [resultMsgId, setResultMsgId] = useState(-1);
    const [title, setTitle] = useState('');
    const [boardId, setBoardId] = useState(0);
    const [isClient, setIsClient] = useState(false);

    let accessToken = '';
    let refreshToken = '';
    let userId = '';
    if (isClient) {
        accessToken = localStorage.getItem('accessToken') || '';
        refreshToken = localStorage.getItem('refreshToken') || '';
        userId = localStorage.getItem("userId") || '';
    }

    const searchParams = useSearchParams();
    const pageId = searchParams.get('pageId');
    const msgId = searchParams.get('msgid');
    const tab = searchParams.get('tab');
    
    const isMyPage = (userId === pageId);
    const tabParam = tab ? '&tab=' + tab : '';
    const backURL = (pageId === 'random') ? '/' : '/userinfo?pageId=' + pageId + tabParam;
    const currentURL = '/userinfo/revealItem?msgid=' + resultMsgId + '&pageId=' + pageId;

    const onShareMessage = () => {
        const clipboardText = clientOrigin + currentURL; 
        navigator.clipboard.writeText(clipboardText);
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
        updateMessageAPI(Number(msgId), accessToken, { deleted: true })
        .then((result) => handleMsgDelete(result));
    };
    const onSaveMessage = () => {
        if (userId === null || userId === '') {
            alert('로그인이 필요한 서비스입니다.');
            redirect('/login?target=' + encodeURIComponent(currentURL));
            return;
        }
        const input: CreateCookieInput = {
            sender: writerNickName,
            title: title,
            content: messageString,
            isPublic: true
        };
        // TODO: Refresh Token
        createMessageAPI(Number(boardId), input, accessToken)
        .then((result) => {
            if (result.success === true) {
                alert('정상적으로 쿠키가 등록되었습니다.');
            }
        });
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
            const newAccessToken = handleRefreshTokenSuccess(result);
            updateMessageAPI(Number(msgId), newAccessToken, { deleted: true })
            .then((result) => {
                if (result.success) {
                    redirect(backURL);
                } else {
                    alert('잘못된 접근입니다.');
                }
            });
        } else {
            handleRefreshTokenFail();
        }
    };
    const handleMsgReveal = (result: MsgRevealResult) => {
        if (result?.data === undefined) return;
        setMessageString(result.data.content);
        setWriterNickName(result.data.sender);
        setResultMsgId(result.data.messageId);
        setTitle(result.data.title);
    };
    const handleBoardResult = (result: BoardResult) => {
        setBoardId(result.data.boards[0].boardId);
    }

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (userId === null || userId === '') return;
        getBoardAPI(userId)
        .then((result) => handleBoardResult(result));
    }, [userId]);
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
        // random message
        if (pageId === 'random' && msgId === null) {
            getRandomMessageAPI()
            .then((result) => handleMsgReveal(result));
            return;
        }
        // target message
        if (msgId === null) return;
        if (msgId === '-1') {
            setMessageString('새해 복 많이 받으세요!');
            setWriterNickName('관리자');
        } else if (msgId !== '') {
            if (userId === '') {
                getMessageAPIGuest(Number(msgId))
                .then((result) => handleMsgReveal(result));
            } else {
                getMessageAPI(Number(msgId), accessToken)
                .then((result) => handleMsgReveal(result));
            }
        }
    }, [msgId, pageId, accessToken])

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
                    <button className='mx-2 btn btn-warning' onClick={onShareMessage}>
                        <Image
                            src="/share.svg"
                            alt="share"
                            width={20}
                            height={20}
                            className="inline-block"
                        />
                         <span>&nbsp;&nbsp;공유</span>
                    </button>
                    { isMyPage ? (
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
                    ) : (
                        <button className='mx-2 btn btn-light' onClick={onSaveMessage}>
                            <Image
                                src="/save.svg"
                                alt="save"
                                width={20}
                                height={20}
                                className="inline-block"
                            />
                            <span>&nbsp;&nbsp;내 쿠키함에 저장</span>
                        </button>
                    )}
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