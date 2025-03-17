'use client'

import { CookieContent, MsgListResult, RefreshTokenResult } from "@/lib/type";
import { getCreatedMessageListAPI, handleRefreshTokenFail, handleRefreshTokenSuccess, refreshTokenAPI } from "@/lib/util";
import { useCallback, useEffect, useState } from "react";
import { East_Sea_Dokdo } from 'next/font/google'

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

export default function CreatedCookieList ()
{
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [prevPage, setPrevPage] = useState(1);
    const [nextPage, setNextPage] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isClient, setIsClient] = useState(false);
    const [cookieArray, setCookieArray] = useState<CookieContent[]>([{
        messageId: -1,
        sender: 'manager', 
        title: 'no cookies', 
        content: 'no cookies',
        opened: true,
        isPublic: true,
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

    const setMsgList = (result: MsgListResult) => {
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
    }

    const handleRefreshTokenOnMsgCreateList = useCallback((result: RefreshTokenResult) => {
        if (userId === '') return;
        if (result.success) {
            const newAccessToken = handleRefreshTokenSuccess(result);
            getCreatedMessageListAPI(userId, newAccessToken, 1, 6)
            .then((result) => {
                if (result.success) { 
                    setMsgList(result);
                } else {
                    alert('Wrong approach.');
                }
            });
        } else {
            handleRefreshTokenFail();
        }
    }, [userId]);
    const handleMsgListResult = useCallback((result: MsgListResult) => {
        if (result.success === false && result.error.code === 401) {
            refreshTokenAPI(accessToken, refreshToken)
            .then((result) => handleRefreshTokenOnMsgCreateList(result));
        } else if (result.success === true) {
            setMsgList(result);
        } 
    }, [accessToken, refreshToken, handleRefreshTokenOnMsgCreateList]);
    const movePrevPage = () => {
        if (hasPrev === false || userId === '') return;
        getCreatedMessageListAPI(userId, accessToken, prevPage, 6)
        .then((result) => handleMsgListResult(result));
    };
    const moveNextPage = () => {
        if (hasNext === false || userId === '') return;
        getCreatedMessageListAPI(userId, accessToken, nextPage, 6)
        .then((result) => handleMsgListResult(result));
    };
    // 기능 추가 기획 전까지 해당 기능 Block
    // const openMessage = (msgId: number) => {
    //     if (msgId === -1) return;
    //     const link = '/userinfo/revealItem?msgid=' + msgId + '&pageId=' + userId + '&tab=' + TAB.CREATED;
    //     redirect(link);
    // };

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (userId === '') return;
        getCreatedMessageListAPI(userId, accessToken, 1, 6)
        .then((result) => handleMsgListResult(result));
    }, [userId, accessToken, handleMsgListResult]);

    return(
        <div className="w-full h-full flex flex-col gap-3 justify-center">
            <div className="flex flex-col justify-center gap-4">
                {cookieArray.map((cookie) => (      
                    <div key={cookie.messageId} className="flex justify-center">
                        <button className="bg-white shadlow-xl pl-7 pr-7 p-1.5 text-xl">
                            <span className={dokdoFont.className}>{cookie.content}</span>
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex justify-center flex-row gap-3 pt-2.5">
                <button onClick={movePrevPage}>&laquo;</button>
                <span>&nbsp;&nbsp;{currentPage} / {lastPage}&nbsp;&nbsp;</span>
                <button onClick={moveNextPage}>&raquo;</button>
            </div>
        </div>
    );
}
