'use client'

import { useCallback, useEffect, useState } from "react";
import Link from 'next/link'
import Image from "next/image";
import localFont from "next/font/local";
import { redirect, useSearchParams } from 'next/navigation'
import ReceivedCookieList from "@/components/receivedCookieList";
import { BoardResult } from "@/lib/type";
import { getBoardAPI } from "@/lib/util";
import CreatedCookieList from "@/components/createdCookieList";
import EditMyInfo from "@/components/editMyInfo";
import { clientOrigin, TAB } from "@/lib/constant";

const pretendardBold = localFont({
    src: "../fonts/Pretendard-Bold.woff",
    display: 'swap',
  });
const selectedTabStyle = "btn btn-dark btn-sm";
const otherTabStyle = "btn btn-outline-dark btn-sm";
  
export default function UserInfo() {
    const [nickName, setNickName] = useState('');
    const [boardId, setBoardId] = useState(0);
    const [tab, setTab] = useState(TAB.RECEIVED);
    const [tabStyle, setTabStyle] = useState([selectedTabStyle, otherTabStyle, otherTabStyle]);
    const [isMyPage, setIsMyPage] = useState(false);
    const [isClient, setIsClient] = useState(false);

    let userId = '';
    if (isClient) {
        userId = localStorage.getItem("userId") || '';
    }

    const searchParams = useSearchParams();
    const pageId = searchParams.get('pageId');
    if (!pageId || pageId === 'null') {
        alert('잘못된 접근입니다.');
        redirect('/');
    }
    const originTab = searchParams.get('tab');
    const name = (nickName === '') ? '회원' : nickName;
    const currentURL = '/userinfo?pageId=' + pageId;

    const chooseTab = useCallback((target: number) =>{
        if (tab === target) return;
        setTab(target);
        switch (target) {
            case TAB.RECEIVED:
                setTabStyle([selectedTabStyle, otherTabStyle, otherTabStyle]);
                break;
            case TAB.CREATED:
                setTabStyle([otherTabStyle, selectedTabStyle, otherTabStyle]);
                break;
            case TAB.MYINFO:
                setTabStyle([otherTabStyle, otherTabStyle, selectedTabStyle]);
                break;
            default:
                break;
        }
    }, [tab]);
    const handleBoardResult = (result: BoardResult) => {
        setNickName(result.data.nickname);
        setBoardId(result.data.boards[0].boardId);
    }
    const share = () => {
        const clipboardText = clientOrigin + currentURL;
        navigator.clipboard.writeText(clipboardText);
        alert('내 페이지 주소가 복사되었습니다. 친구들에게 공유해보세요.');
    };

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (originTab) {
            chooseTab(Number(originTab));
        }
    }, [originTab, chooseTab])
    useEffect(() => {
        setIsMyPage(userId === pageId);
    }, [userId, pageId]);
    useEffect(() => {
        if (pageId === null) return;
        getBoardAPI(pageId)
        .then((result) => handleBoardResult(result));
    }, [pageId]);

    return(
        <div className="grid grid-rows-[100px_1fr_80px] items-center justify-items-center min-h-dvh p-6 pb-10 gap-1">
            <header className="row-start-1 gap-3 items-center justify-center text-center pt-0">
                <div className='text-xl mb-0.5'>
                    <span className={`${pretendardBold.className} ${pretendardBold.className} antialiased `}>
                        {name}
                    </span>
                    <span>
                        님의 포춘 쿠키
                    </span>
                </div>
                { isMyPage ? (
                    <div className="text-gray-600">
                        친구에게 공유해서 쿠키를 요청하세요!&nbsp;&nbsp;
                    </div>
                ) : (
                    <div className="text-gray-600">
                        포춘 쿠키로 새해 덕담을 남겨보세요!
                    </div>
                )}
                { isMyPage &&
                    <div className="flex flex-row gap-2 justify-center pt-3">
                        <button type="button" className={tabStyle[0]} style={{borderRadius: "30px"}} onClick={() => chooseTab(TAB.RECEIVED)}>받은 쿠키</button>
                        <button type="button" className={tabStyle[1]} style={{borderRadius: "30px"}} onClick={() => chooseTab(TAB.CREATED)}>만든 쿠키</button>
                        <button type="button" className={tabStyle[2]} style={{borderRadius: "30px"}} onClick={() => chooseTab(TAB.MYINFO)}>회원 정보</button>
                    </div>
                }
            </header>
            <div className="flex flex-col row-start-2 items-center w-full h-5/6 pt-3">
                { tab === TAB.RECEIVED && <ReceivedCookieList pageId={pageId} boardId={boardId}/> }
                { tab === TAB.CREATED && <CreatedCookieList/> }
                { tab === TAB.MYINFO && <EditMyInfo/> }
            </div>
            <footer className="row-start-3 flex flex-col gap-3 items-center justify-center">
                { isMyPage ? (
                    <div className="flex flex-row gap-3">
                        <button type="button" className="btn btn-warning" onClick={share}>
                            <Image
                                src="/share.svg"
                                alt="share"
                                width={20}
                                height={20}
                                className="inline-block"
                            />
                            <span>&nbsp;&nbsp;쿠키 요청하기</span>
                        </button>
                        <Link href="/"><button type="button" className="btn btn-light">홈</button></Link> 
                    </div>
                ) : (
                    <div className="flex flex-row gap-3">
                        <Link href={'/userinfo/addItem?pageId=' + pageId + "&boardId=" + boardId}><button type="button" className="btn btn-warning">+ 쿠키 만들어주기</button></Link>
                        <Link href="/"><button type="button" className="btn btn-light">홈</button></Link> 
                    </div>
                )}
            </footer>
        </div>
    );
}