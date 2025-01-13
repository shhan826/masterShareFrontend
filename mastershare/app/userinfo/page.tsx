'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CookieList from "@/components/cookieList";

export interface CookieData {
    messageId: string,
    sender: string,
    title: string,
    opened: boolean,
    createdAt: string,
}
interface MsgListResult {
    sucess: boolean,
    data: {
        dataList: [CookieData],
        pageRequest: {
            page: number,
            size: number
        },
        hasPrev: boolean,
        hasNext: boolean,
        totalDataCount: number,
        currentPage: number,
        prevPage: number,
        nextPage: number,
        lastPage: number
    },
    error: {
        code: number,
        message: string
    }
}
interface BoardResult {
    success: boolean,
    data: {
        username: string,
        nickname: string,
        maxSize: number
    },
    error: {
        code: number,
        message: string
    }
}

export default function UserInfo() {
    const [pageId, setPageId] = useState('');
    const [nickName, setNickName] = useState('');
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [prevPage, setPrevPage] = useState(1);
    const [nextPage, setNextPage] = useState(2);
    const [lastPage, setLastPage] = useState(1);
    const [cookieArray, setCookieArray] = useState<CookieData[]>([{
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
    // TODO: 메세지 리스트를 보는 행위는 권한 상관없이 가능해야 함
    useEffect(() => {
        if (pageId !== '') {
            const fetchURL = "http://localhost:8080/boards/v1/" + pageId + "/board";
            fetch(fetchURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                })
                .then((response) => response.json())
                .then((result) => handleBoardResult(result));
        }
    }, [pageId]);
    useEffect(() => {
        if (pageId !== '') {
            const fetchURL = "http://localhost:8080/boards/v1/" + pageId + "/board/messages?page=1&size=6";
            fetch(fetchURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                })
                .then((response) => response.json())
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
    // TODO: 메세지 리스트를 보는 행위는 권한 상관없이 가능해야 함
    const movePrevPage = () => {
        if (hasPrev === false) return;
        const fetchURL = "http://localhost:8080/boards/v1/" + pageId + "/board/messages?page=" + prevPage + "&size=6";
        fetch(fetchURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            })
            .then((response) => response.json())
            .then((result) => handleMsgListResult(result));
    }
    const moveNextPage = () => {
        if (hasNext === false) return;
        const fetchURL = "http://localhost:8080/boards/v1/" + pageId + "/board/messages?page=" + nextPage + "&size=6";
        fetch(fetchURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            })
            .then((response) => response.json())
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
                        <Link href={"/userinfo/revealItem?id=" + randomMsgId}><button type="button" className="btn btn-warning">무작위로 열기</button></Link>
                        <button type="button" className="btn btn-light" onClick={share}>친구에게 알리기</button>
                    </div>
                ) : (
                    <div className="flex flex-row gap-3">
                        <Link href={'/userinfo/addItem?pageId=' + pageId}><button type="button" className="btn btn-warning">쿠키 만들어주기</button></Link>
                        <Link href="/login"><button type="button" className="btn btn-light">내 쿠키함 가기</button></Link>
                    </div>
                )}
                { userId && <button onClick={logout}>로그아웃</button> }
            </footer>
        </div>
    );
}