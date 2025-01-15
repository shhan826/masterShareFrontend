'use client'

import CloseX from "@/components/closeX";
import { redirect } from "next/navigation";
import { East_Sea_Dokdo } from 'next/font/google'
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CreateCookieInput, CreateCookieResult } from "@/lib/type";
import { createMessageAPI } from "@/lib/util";

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

export default function AddItem ()
{
    // TODO: 폰트, 이미지 등 다양한 옵션으로 쿠키를 설정할 수 있게 하면 재밌을 듯
    const ref = useRef<HTMLTextAreaElement>(null);

    const accessToken = localStorage.getItem('accessToken') as string;

    const [sender, setSender] = useState('익명');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [pageId, setPageId] = useState('');
    const [sampleString, setSampleString] = useState('');

    const sampleStringIndex = Math.floor(Math.random() * 6);
    const sampleStringArray = [
        '좋은 인연을\n만나게 될 지도?',
        '고민하고 있던 일들이\n곧 풀릴 예정',
        '한 해 내내\n잔병치레 없는 건강',
        '베풀면\n배로 돌아올 것',
        '예상치 못한\n수익이 들어옴',
        '좋은 운이 있어,\n소중히 사용할 것'
    ];

    useEffect(() => {
        // 1) url param
        const url = new URL(window.location.href);
        const urlParam = url.searchParams.get('pageId');
        if (urlParam === null) {
            alert('잘못된 접근입니다.');
            redirect('/');
        } else {
            setPageId(urlParam);
        }
        // 2) sample string
        setSampleString(sampleStringArray[sampleStringIndex]);
    }, []);

    const onTextContentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);

        const length = content.length;
        const target = ref.current;
        if (target === null) return;
        if (length < 60) {
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
    const checkInputInfo = () => {
        if (content === '') {
            alert('내용을 입력해주세요');
            return false;
        }
        if (title === '') {
            if (content.length > 5) {
                setTitle(content.substring(0, 5));
            } else {
                setTitle(content);
            }
        }
        return true;
    }
    const handleCreateCookie = (result: CreateCookieResult) => {
        if (result !== undefined) {
            alert('정상적으로 쿠키가 등록되었습니다.');
        } 
        history.back();
    }
    const createCookie = () => {
        if (checkInputInfo() === false) return;

        const input: CreateCookieInput = {
            sender: sender,
            title: title,
            content: content
        }
        createMessageAPI(pageId, input, accessToken)
        .then((result) => handleCreateCookie(result));
    };

    return(
        <div>
            <div className='absolute w-full text-right z-2'>
                <CloseX backURL={'/userinfo?pageid=' + pageId}/>
            </div>
            <div className='absolute w-full h-full flex flex-col justify-center items-center'>
                <br/>
                <Image
                    aria-hidden
                    src="/mainImage.png"
                    alt="main image"
                    width={300}
                    height={300}
                    className="opacity-50"
                />
                <button className='mx-3 btn btn-primary z-2' onClick={createCookie}>만들기</button>
            </div>
            <div className='absolute flex flex-col justify-center items-center w-full h-screen z-1'>
                <div className='text-left w-5/6 mb-1'>
                    <input
                        type='text' 
                        className="text-center text-md p-2 shadow-xl" 
                        maxLength={10} placeholder="제목"
                        onChange={onTitleHandler}>
                    </input> 
                </div>
                <div className='bg-white w-5/6 flex flex-col justify-center rounded-md shadow-xl'>
                    <textarea 
                        ref={ref}
                        className={dokdoFont.className + " text-center resize-none outline-none text-3xl m-2"}
                        maxLength={80} placeholder={sampleString} 
                        onChange={onTextContentHandler}>
                    </textarea> 
                </div>
                <div className='text-right w-5/6 mt-1'>
                    <input 
                        className="text-center text-md p-2 shadow-xl" 
                        maxLength={10} placeholder="글쓴이 이름" 
                        onChange={onSenderHandler}>
                    </input>
                </div>
            </div>
        </div>
    );
}