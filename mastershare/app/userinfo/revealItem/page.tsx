'use client'

import Image from "next/image";
import { East_Sea_Dokdo } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import { redirect } from 'next/navigation'
import CloseX from "@/components/closeX";
import { MsgDeleteResult, MsgRevealResult } from "@/lib/type";
import { deleteMessageAPI, getMessageAPI } from "@/lib/util";

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

export default function RevealItem () {
    const msgBoxRef = useRef<HTMLDivElement>(null);

    const [msgId, setMsgId] = useState('');
    const [pageId, setPageId] = useState('');
    const [messageString, setMessageString] = useState('');
    const [writerNickName, setWriterNickName] = useState('');

    const accessToken = localStorage.getItem('accessToken') as string;
    const backURL = '/userinfo?pageid=' + pageId;

    const onShareMessage = async () => {
        navigator.clipboard.writeText(window.location.href);
        alert('주소가 복사되었습니다.');
    };
    const onDeleteMessage = () => {
        if (msgId === '-1') {
            alert('삭제할 수 없는 내용입니다.');
            return;
        }
        if (confirm("해당 포춘 쿠키를 삭제하시겠습니까?") === false) {
            return;
        }
        deleteMessageAPI(msgId, accessToken)
        .then((result) => handleMsgDelete(result));
    };
    const handleMsgDelete = (result: MsgDeleteResult) => {
        if (result.success === false) {
            alert('삭제할 수 없는 내용입니다.');
        } else {
            redirect(backURL);
        }
    }
    const handleMsgReveal = (result: MsgRevealResult) => {
        if (result?.data === undefined) return;
        setMessageString(result.data.content);
        setWriterNickName(result.data.sender);
    };

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
        const url = new URL(window.location.href);
        const urlParam1 = url.searchParams.get('msgid');
        const urlParam2 = url.searchParams.get('pageid');
        if (urlParam1 === null) {
            alert('잘못된 접근입니다.');
            redirect('/');
        } else {
            setMsgId(urlParam1);
            if (urlParam2 !== null) {
                setPageId(urlParam2);
            }
        }
    }, []);
    useEffect(() => {
        if (msgId === '-1') {
            setMessageString('새해 복 많이 받으세요!');
            setWriterNickName('관리자');
        } else if (msgId !== '') {
            getMessageAPI(msgId, accessToken)
            .then((result) => handleMsgReveal(result));
        }
    }, [msgId])

    return(
        <div>
            <div className='absolute w-full text-right z-2'>
                <CloseX backURL={backURL}/>
            </div>
            <div className='absolute w-full h-full flex flex-col justify-center items-center'>
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
                        <span>&nbsp;&nbsp;공유하기</span>
                    </button>
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
                </div>
            </div>
            <div ref={msgBoxRef} className='absolute flex flex-col justify-center items-center w-full h-screen z-1' style={{opacity: 0}}>
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