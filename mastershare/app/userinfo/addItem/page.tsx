'use client'

import CloseX from "@/components/closeX";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CreateCookieResult {
    sucess: boolean,
    data: {
        messageId: string,
        sender: string,
        title: string,
        opend: boolean,
        createdAt: string
    },
    error: {
        code: number,
        message: string
    }
}

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
        '좋은 인연을 만나게 될 지도?',
        '고민하고 있던 일들이 곧 풀릴 예정',
        '한 해 내내 잔병치레 없는 건강',
        '베풀면 배로 돌아올 것',
        '예상치 못한 수익이 들어옴',
        '좋은 운이 있어, 소중히 사용할 것'
    ];

    useEffect(() => {
        // url param
        const url = new URL(window.location.href);
        const urlParam = url.searchParams.get('pageId');
        if (urlParam === null) {
            alert('잘못된 접근입니다.');
            redirect('/');
        } else {
            setPageId(urlParam);
        }
        // sample string
        setSampleString(sampleStringArray[sampleStringIndex]);
    }, []);

    const onTextContentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);

        const length = content.length;
        const target = ref.current;
        if (target === null) return;
        if (length < 30) {
            target.style.fontSize = "1.25rem";
        } else if (length < 60) {
            target.style.fontSize = "1rem";
        } else {
            target.style.fontSize = "0.75rem";
        }
    };
    const onTitleHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value);
    };
    const onSenderHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    // TODO: 메시지 등록할 때 로그인 상태를 요구할 건지 의사결정 필요
    const createCookie = () => {
        if (checkInputInfo() === false) return;
        const fetchURL = "http://localhost:8080/boards/v1/" + pageId + "/board/message/new";
        fetch(fetchURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                sender: sender,
                title: title,
                content: content
            }),
            })
            .then((response) => response.json())
            .then((result) => handleCreateCookie(result));
    };
    const handleCreateCookie = (result: CreateCookieResult) => {
        if (result !== undefined) {
            alert('정상적으로 쿠키가 등록되었습니다.');
        } 
        history.back();
    }

    return(
        <div>
            <div className='absolute w-full text-right z-2'>
                <CloseX backURL={'/userinfo?pageid=' + pageId}/>
            </div>
            <div className='absolute w-full h-full flex flex-col justify-center items-center'>
                <Image
                    aria-hidden
                    src="/mainImage.png"
                    alt="main image"
                    width={400}
                    height={400}
                />
            </div>
            <div className='absolute flex flex-col justify-center items-center w-full h-screen z-1'>
                <div className='text-left w-5/6'>
                    <textarea 
                        className="text-center resize-none outline-none h-7 text-md" 
                        maxLength={10} placeholder="제목"
                        onChange={onTitleHandler}>
                    </textarea> 
                </div>  
                <br/>
                <div className='bg-white w-5/6 h-16 flex flex-col justify-center rounded-md shadow-xl'>
                    <textarea 
                        ref={ref}
                        className="text-center resize-none w-full outline-none h-7 text-lg" 
                        maxLength={80} placeholder={sampleString} 
                        onChange={onTextContentHandler}>
                    </textarea> 
                </div>
                <br/>
                <div className='text-right w-5/6'>
                    <textarea 
                        className="text-center resize-none outline-none h-7 text-md" 
                        maxLength={20} placeholder="작성자" 
                        onChange={onSenderHandler}>
                    </textarea>
                </div>
                <br/>
                <button className='mx-3 btn btn-secondary' onClick={createCookie}>만들기</button>
            </div>
        </div>
    );
}