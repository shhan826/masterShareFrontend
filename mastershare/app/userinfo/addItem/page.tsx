'use client'

import CloseX from "@/components/closeX";
import { redirect, useSearchParams } from "next/navigation";
import { East_Sea_Dokdo } from 'next/font/google'
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CreateCookieInput, CreateCookieResult, RefreshTokenResult } from "@/lib/type";
import { createMessageAPI, createRandomMessageAPI, handleRefreshTokenFail, handleRefreshTokenSuccess, refreshTokenAPI } from "@/lib/util";

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

export default function AddItem ()
{
    // TODO: 폰트, 이미지 등 다양한 옵션으로 쿠키를 설정할 수 있게 하면 재밌을 듯
    const ref = useRef<HTMLTextAreaElement>(null);

    const [sender, setSender] = useState('익명의 글쓴이');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [sampleString, setSampleString] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isClient, setIsClient] = useState(false);

    const searchParams = useSearchParams();

    const pageId = searchParams.get('pageId');
    const boardId = searchParams.get('boardId');
    const backURL = pageId === 'random' ? '/' : '/userinfo?pageId=' + pageId;
    
    let accessToken = '';
    let refreshToken = '';
    let userId = '';
    let nickName = '';
    if (isClient) {
        accessToken = localStorage.getItem('accessToken') || '';
        refreshToken = localStorage.getItem('refreshToken') || '';
        userId = localStorage.getItem("userId") || '';
        nickName = localStorage.getItem('nickName') || '';
    }

    useEffect(() => {
        if (!isClient) return;
        if (userId === null || userId === '') {
            redirect('/login?target=' + encodeURIComponent(backURL));
        }
    }, [userId, isClient, backURL]);
    useEffect(() => {
        // 0) 클라이언트용 코드 구분
        setIsClient(true);
        // 1) 작성 예시 랜덤 적용
        const sampleStringArray = [
            '좋은 인연을\n만나게 될 지도?',
            '고민하고 있던 일들이\n곧 풀릴 예정',
            '한 해 내내\n잔병치레 없는 건강',
            '베풀면\n배로 돌아올 것',
            '예상치 못한\n수익이 들어옴',
            '좋은 운이 있어,\n소중히 사용할 것'
        ];
        const sampleStringIndex = Math.floor(Math.random() * 6);
        setSampleString(sampleStringArray[sampleStringIndex]);
    }, []);
    useEffect(() => {
        if (nickName && nickName !== '') setSender(nickName);
    }, [nickName]);

    const onTextContentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        const length = content.length;
        const target = ref.current;
        if (target === null) return;
        if (length < 50) {
            target.style.fontSize = "1.87rem";
        } else {
            target.style.fontSize = "1.5rem";
        }
    };
    const onTitleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const onSenderHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSender(e.target.value);
    };
    const onCheckBoxHandler = () => {
        setIsPublic(!isPublic);
    }
    const checkInputInfo = () => {
        if (content === '') {
            alert('내용을 한 글자 이상 입력해주세요.');
            return false;
        }
        return true;
    }
    const handleCreateCookie = (input: CreateCookieInput, result: CreateCookieResult) => {
        if (result.success === false && result.error.code === 401) {
            refreshTokenAPI(accessToken, refreshToken)
            .then((result) => handleRefreshTokenOnMsgCreate(input, result));
        } else if (result.success === true) {
            alert('정상적으로 쿠키가 등록되었습니다.');
            redirect(backURL);
        } 
    }
    const handleRefreshTokenOnMsgCreate = (input: CreateCookieInput, result: RefreshTokenResult) => {
        if (result.success) {
            const newAccessToken = handleRefreshTokenSuccess(result);
            if (pageId === 'random') {
                createRandomMessageAPI(input, newAccessToken);
            } else {
                if (!boardId) return;
                createMessageAPI(Number(boardId), input, accessToken);
            }
            alert('정상적으로 쿠키가 등록되었습니다.');
            redirect(backURL);
        } else {
            handleRefreshTokenFail();
        }
    };
    const createCookie = () => {
        if (checkInputInfo() === false) return;
        let adjustedTitle = title;
        if (title === '') {
            adjustedTitle = (content.length > 10) ? (content.substring(0, 8) + "..") : content;
        }
        const input: CreateCookieInput = {
            sender: sender,
            title: adjustedTitle,
            content: content,
            isPublic: isPublic
        }
        if (pageId === 'random') {
            createRandomMessageAPI(input, accessToken)
            .then((result) => handleCreateCookie(input, result));
        } else {
            if (!boardId) return;
            createMessageAPI(Number(boardId), input, accessToken)
            .then((result) => handleCreateCookie(input, result));
        }
    };

    return(
        <div>
            <div className='absolute w-full text-right z-2'>
                <CloseX backURL={backURL}/>
            </div>
            <div className='absolute w-full h-dvh flex flex-col justify-center items-center'>
                <br/>
                <Image
                    aria-hidden
                    src="/mainImage.png"
                    alt="main image"
                    width={300}
                    height={300}
                    className="opacity-50"
                />
                { pageId !== 'random' && 
                    <div className='text-right w-5/6 mb-2.5 z-2'>
                        <input type="checkbox" checked={isPublic} onChange={onCheckBoxHandler}/>
                        <span> 전체 공개</span>
                    </div>
                }
                <button className='mx-3 btn btn-primary z-2' onClick={createCookie}>쿠키 만들기</button>
            </div>
            <div className='absolute flex flex-col justify-center items-center w-full h-dvh z-1'>
                <div className='text-left w-5/6 mb-1'>
                    <input
                        type='text' 
                        className={dokdoFont.className + " text-center text-xl p-2 shadow-xl"}
                        maxLength={10} placeholder="제목"
                        onChange={onTitleHandler}>
                    </input> 
                </div>
                <div className='bg-white w-5/6 flex flex-col justify-center rounded-md shadow-xl'>
                    <textarea 
                        ref={ref}
                        className={dokdoFont.className + " text-center resize-none outline-none text-3xl m-2"}
                        maxLength={65} placeholder={sampleString} 
                        onChange={onTextContentHandler}>
                    </textarea> 
                </div>
                <div className='text-right w-5/6 mt-1'>
                    <input 
                        className="text-center text-md p-2 shadow-xl" 
                        maxLength={10} placeholder={"- " + sender}
                        onChange={onSenderHandler}>
                    </input>
                </div>
                <br/>
            </div>
        </div>
    );
}