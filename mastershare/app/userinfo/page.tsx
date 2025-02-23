'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from "next/image";
import localFont from "next/font/local";
import { redirect, useSearchParams } from 'next/navigation'
import ReceivedCookieList from "@/components/receivedCookieList";
import { BoardResult, CookieContent, MsgListResult } from "@/lib/type";
import { getBoardAPI, getMessageListAPI } from "@/lib/util";

const pretendardBold = localFont({
    src: "../fonts/Pretendard-Bold.woff",
    display: 'swap',
  });

const TAB = {
    RECEIVED: 0,
    CREATED: 1,
    MYINFO: 2
};

const selectedTabStyle = "btn btn-dark btn-sm";
const otherTabStyle = "btn btn-outline-dark btn-sm";
  
export default function UserInfo() {
    const [nickName, setNickName] = useState('');
    const [boardId, setBoardId] = useState(0);
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [prevPage, setPrevPage] = useState(1);
    const [nextPage, setNextPage] = useState(2);
    const [lastPage, setLastPage] = useState(1);
    const [tab, setTab] = useState(TAB.RECEIVED);
    const [tabStyle, setTabStyle] = useState([selectedTabStyle, otherTabStyle, otherTabStyle]);

    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);

    const [cookieArray, setCookieArray] = useState<CookieContent[]>([{
        messageId: -1,
        sender: '관리자', 
        title: '기본 제공 쿠키', 
        content: '새해 복 많이 받으세요!',
        opened: false,
        createdAt: ''
    }]);

    let accessToken = '';
    let refreshToken = '';
    let userId = '';
    if (isClient) {
        accessToken = localStorage.getItem('accessToken') || '';
        refreshToken = localStorage.getItem('refreshToken') || '';
        userId = localStorage.getItem("userId") || '';
    }

    const pageId = searchParams.get('pageid');
    const name = (nickName === '') ? '회원' : nickName;
    const isMyPage = (userId === pageId);

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (pageId === null) return;
        getBoardAPI(pageId)
        .then((result) => handleBoardResult(result));
    }, [pageId]);
    useEffect(() => {
        if (boardId === 0) return;
        getMessageListAPI(boardId, 1, 6)
        .then((result) => handleMsgListResult(result));
    }, [boardId]);

    const handleBoardResult = (result: BoardResult) => {
        setNickName(result.data.nickname);
        setBoardId(result.data.boards[0].boardId);
    }
    const handleMsgListResult = (result: MsgListResult) => {
        const resultData = result.data;
        const dataList = resultData.dataList;
        if (dataList !== undefined && dataList.length >= 1) {
            setCookieArray(dataList);
        }
        setHasPrev(resultData.hasPrev);
        setHasNext(resultData.hasNext);
        setCurrentPage(resultData.currentPage);
        setLastPage(resultData.lastPage);
        setPrevPage(resultData.prevPage);
        setNextPage(resultData.nextPage);
    };
    const logout = () => {
        if (isClient) {
            localStorage.removeItem("userId");
            localStorage.removeItem("nickName");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
        alert('로그아웃 되었습니다.');
        redirect('/');
    };
    const share = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('내 페이지 주소가 복사되었습니다. 친구들에게 공유해보세요.');
    };
    const movePrevPage = () => {
        if (hasPrev === false || boardId === 0) return;
        getMessageListAPI(boardId, prevPage, 6)
        .then((result) => handleMsgListResult(result));
    };
    const moveNextPage = () => {
        if (hasNext === false || boardId === 0) return;
        getMessageListAPI(boardId, nextPage, 6)
        .then((result) => handleMsgListResult(result));
    };
    const chooseTab = (target: number) =>{
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
    }
    // Carousel 방식으로 개선하면 더 좋을 듯
    // 현재 몇 페이지를 보고 있는지에 대한 정보도 Params로 넣어야 할 듯
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
                 <div className="flex flex-row gap-2 justify-center pt-3">
                    <button type="button" className={tabStyle[0]} style={{borderRadius: "30px"}} onClick={() => chooseTab(TAB.RECEIVED)}>받은 쿠키</button>
                    <button type="button" className={tabStyle[1]} style={{borderRadius: "30px"}} onClick={() => chooseTab(TAB.CREATED)}>만든 쿠키</button>
                    <button type="button" className={tabStyle[2]} style={{borderRadius: "30px"}} onClick={() => chooseTab(TAB.MYINFO)}>회원 정보</button>
                </div>
            </header>

            <div className="flex flex-col row-start-2 items-center w-full h-5/6">
                <ReceivedCookieList cookies={cookieArray} pageId={pageId}/>
            </div>
            <footer className="row-start-3 flex flex-col gap-3 items-center justify-center">
                <div className="flex flex-row gap-3 pt-5">
                    <button onClick={movePrevPage}>&laquo;</button>
                    <span>&nbsp;&nbsp;{currentPage} / {lastPage}&nbsp;&nbsp;</span>
                    <button onClick={moveNextPage}>&raquo;</button>
                </div>
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
                        <Link href="/"><button type="button" className="btn btn-light">메인 페이지</button></Link> 
                        { userId && <button className="btn btn-light" style={{color: "gray"}} onClick={logout}>로그아웃</button> }
                    </div>
                ) : (
                    <div className="flex flex-row gap-3">
                        <Link href={'/userinfo/addItem?pageId=' + pageId + "&boardId=" + boardId}><button type="button" className="btn btn-warning">+ 쿠키 만들어주기</button></Link>
                        { userId ? (
                            <Link href="/login"><button type="button" className="btn btn-light">내 쿠키함 가기</button></Link> 
                            ) : (
                            <Link href="/login"><button type="button" className="btn btn-light">로그인</button></Link> 
                        )}
                    </div>
                )}
            </footer>
        </div>
    );
}