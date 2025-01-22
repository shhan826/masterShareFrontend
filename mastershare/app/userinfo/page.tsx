'use client'

import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from "next/image";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { redirect, useSearchParams } from 'next/navigation'
import CookieList from "@/components/cookieList";
import { BoardResult, CookieContent, MsgListResult, MsgOpenResult, RefreshTokenResult } from "@/lib/type";
import { getBoardAPI, getMessageListAPI, openMessageAPI, refreshTokenAPI } from "@/lib/util";

const pretendardBold = localFont({
    src: "../fonts/Pretendard-Bold.woff",
    display: 'swap',
  });

const title = "포춘 쿠기";
const description = "친구에게 쿠키로 덕담을 남겨주세요!";
export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    url: 'https://lettergram.store',
    images: [
      {
        url: '/thumbnail.png',
        alt: 'fortune cookie'
      }
    ]
  },
  twitter: {
    title: title,
    description: description,
    images: [
      {
        url: '/thumbnail.png',
        alt: 'fortune cookie'
      }
    ]
  }
};

export default function UserInfo() {
    const [nickName, setNickName] = useState('');
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [prevPage, setPrevPage] = useState(1);
    const [nextPage, setNextPage] = useState(2);
    const [lastPage, setLastPage] = useState(1);

    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);

    const [cookieArray, setCookieArray] = useState<CookieContent[]>([{
        messageKey: '-1',
        sender: '관리자', 
        title: '기본 제공 쿠키', 
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
    const randomMsgIndex = Math.floor(Math.random() * cookieArray.length);
    const randomMsgId = cookieArray[randomMsgIndex].messageKey;
    const randomMsgLink = '/userinfo/revealItem?msgid=' + randomMsgId + '&pageid=' + pageId;

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (pageId === null) return;
        // 1) 게시판 정보
        getBoardAPI(pageId)
        .then((result) => handleBoardResult(result));
        // 2) 메시지 리스트
        getMessageListAPI(pageId, 1, 6)
        .then((result) => handleMsgListResult(result));
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
    const openRandomMessage = () => {
        if (randomMsgId === '-1') {
            redirect(randomMsgLink);
            return;
        }
        openMessageAPI(randomMsgId, accessToken)
        .then((result) => handleOpenRandomMessage(result));
    };
    const handleOpenRandomMessage = (result: MsgOpenResult) => {
        if (result.success === false && result.error.code === 401) {
            refreshTokenAPI(accessToken, refreshToken)
            .then((result) => handleRefreshTokenOnOpenMessage(result));
        } else if (result.success === true) {
            redirect(randomMsgLink);
        }
    };
    const handleRefreshTokenOnOpenMessage = (result: RefreshTokenResult) => {
        if (result.success) {
            const newAccessToken = result.data.accessToken;
            const newRefreshToken = result.data.refreshToken;
            if (isClient) {
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
            }
            openMessageAPI(randomMsgId, newAccessToken)
            .then((result) => {
                if (result.success) {
                    redirect(randomMsgLink);
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
    const movePrevPage = () => {
        if (hasPrev === false || pageId === null) return;
        getMessageListAPI(pageId, prevPage, 6)
        .then((result) => handleMsgListResult(result));
    };
    const moveNextPage = () => {
        if (hasNext === false || pageId === null) return;
        getMessageListAPI(pageId, nextPage, 6)
        .then((result) => handleMsgListResult(result));
    };

    // 네비게이션 추가해서 로그아웃, 내역 보기 등 메뉴 구겨담아야 할 듯
    // Carousel 방식으로 개선하면 더 좋을 듯
    // 현재 몇 페이지를 보고 있는지에 대한 정보도 Params로 넣어야 할 듯
    return(
        <div className="grid grid-rows-[80px_1fr_80px] items-center justify-items-center min-h-dvh p-6 pb-10 gap-1">
            <header className="row-start-1 gap-3 items-center justify-center text-center pt-0">
                <div className='text-xl mb-0.5'>
                    <span className={`${pretendardBold.className} ${pretendardBold.className} antialiased `}>
                        {name}
                    </span>
                    <span>
                        님의 포춘 쿠키&nbsp;..&nbsp;🍪
                    </span>
                </div>
                { isMyPage ? (
                    <div className="text-gray-600">
                        원하는 쿠키를 열어보세요!&nbsp;&nbsp;
                        <button type="button" className="underline" onClick={openRandomMessage}>무작위 열기</button>
                    </div>
                ) : (
                    <div className="text-gray-600">
                        포춘 쿠키로 새해 덕담을 남겨보세요!
                    </div>
                )}
            </header>
            <div className="flex flex-col row-start-2 items-center w-full h-5/6">
                <CookieList cookies={cookieArray} pageId={pageId}/>
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
                            <span>&nbsp;&nbsp;공유하기</span>
                        </button>
                        { userId && <button className="btn btn-light" style={{color: "gray"}} onClick={logout}>로그아웃</button> }
                    </div>
                ) : (
                    <div className="flex flex-row gap-3">
                        <Link href={'/userinfo/addItem?pageid=' + pageId}><button type="button" className="btn btn-warning">+ 쿠키 만들어주기</button></Link>
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