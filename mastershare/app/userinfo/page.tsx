'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CookieList from "@/components/cookieList";
import { BoardResult, CookieContent, MsgListResult, MsgOpenResult } from "@/lib/type";
import { getBoardAPI, getMessageListAPI, openMessageAPI } from "@/lib/util";

export default function UserInfo() {
    const [pageId, setPageId] = useState('');
    const [nickName, setNickName] = useState('');
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [prevPage, setPrevPage] = useState(1);
    const [nextPage, setNextPage] = useState(2);
    const [lastPage, setLastPage] = useState(1);
    const [cookieArray, setCookieArray] = useState<CookieContent[]>([{
        messageId: '-1',
        sender: '관리자', 
        title: '기본제공쿠키', 
        opened: false,
        createdAt: ''
    }]);

    const accessToken = localStorage.getItem('accessToken') as string;
    const userId = localStorage.getItem("userId");

    const name = (nickName === '') ? '회원' : nickName;
    const isMyPage = (userId === pageId);
    const randomMsgIndex = Math.floor(Math.random() * cookieArray.length);
    const randomMsgId = cookieArray[randomMsgIndex].messageId;
    const randomMsgLink = '/userinfo/revealItem?msgid=' + randomMsgId + '&pageid=' + pageId;

    useEffect(() => {
        const url = new URL(window.location.href);
        const urlParam = url.searchParams.get('pageid');
        if (urlParam === null) {
            alert('잘못된 접근입니다.');
            redirect('/');
        } else {
            setPageId(urlParam);
        }
    }, []);
    useEffect(() => {
        if (pageId !== '') {
            // 1) 게시판 정보
            getBoardAPI(pageId)
            .then((result) => handleBoardResult(result));
            // 2) 메시지 리스트
            getMessageListAPI(pageId, 1, 6)
            .then((result) => handleMsgListResult(result));
        }
    }, [pageId]);

    const handleBoardResult = (result: BoardResult) => {
        setNickName(result.data.nickname);
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
        localStorage.removeItem("userId");
        localStorage.removeItem("nickName");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert('로그아웃 되었습니다.');
        redirect('/');
    };
    const share = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('내 페이지 주소가 복사되었습니다. 친구들에게 공유해보세요.');
    };
    const openRandomMessage = () => {
        if (randomMsgId === '-1') {
            redirect(randomMsgLink);
            return;
        }
        openMessageAPI(randomMsgId, accessToken)
        .then((result) => handleOpenMessage(result));
    };
    const handleOpenMessage = (result: MsgOpenResult) => {
        redirect(randomMsgLink);
    }
    const movePrevPage = () => {
        if (hasPrev === false) return;
        getMessageListAPI(pageId, prevPage, 6)
        .then((result) => handleMsgListResult(result));
    }
    const moveNextPage = () => {
        if (hasNext === false) return;
        getMessageListAPI(pageId, nextPage, 6)
        .then((result) => handleMsgListResult(result));
    }

    // 네비게이션 추가해서 로그아웃, 내역 보기 등 메뉴 구겨담아야 할 듯
    return(
        <div className="grid grid-rows-[80px_1fr_80px] items-center justify-items-center min-h-screen p-6 pb-10 gap-1">
            <header className="row-start-1 gap-3 items-center justify-center text-center pt-10">
                <p className='font-bold text-lg'>{name}님의 포춘 쿠키</p>
                { isMyPage ? (
                    <p>원하는 쿠키를 선택하여 열어보세요!</p>
                ) : (
                    <p>{name}님에게 쿠키로 덕담을 남겨보세요!</p>
                )}
            </header>
            <div className="flex flex-col row-start-2 items-center w-full h-5/6">
                <CookieList cookies={cookieArray} isRevealPossible={isMyPage} pageId={pageId}/>
            </div>
            <footer className="row-start-3 flex flex-col gap-3 items-center justify-center">
                <div className="flex flex-row gap-3">
                    <button onClick={movePrevPage}>&laquo;</button>
                    <span>&nbsp;&nbsp;{currentPage} / {lastPage}&nbsp;&nbsp;</span>
                    <button onClick={moveNextPage}>&raquo;</button>
                </div>
                { isMyPage ? (
                    <div className="flex flex-row gap-3">
                        <button type="button" className="btn btn-warning" onClick={openRandomMessage}>무작위 열기</button>
                        <button type="button" className="btn btn-light" onClick={share}>공유하기</button>
                    </div>
                ) : (
                    <div className="flex flex-row gap-3">
                        <Link href={'/userinfo/addItem?pageId=' + pageId}><button type="button" className="btn btn-warning">쿠키 만들어주기</button></Link>
                        <Link href="/login"><button type="button" className="btn btn-light">로그인</button></Link>
                    </div>
                )}
                { userId && <button onClick={logout}>로그아웃</button> }
            </footer>
        </div>
    );
}