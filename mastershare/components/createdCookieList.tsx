'use client'

import { CookieContent, MsgListResult } from "@/lib/type";
import { getMessageListAPI } from "@/lib/util";
import { useEffect, useState } from "react";
import { East_Sea_Dokdo } from 'next/font/google'

interface CookieListProps {
    pageId: string | null
    boardId: number
}

const dokdoFont = East_Sea_Dokdo({
    preload: false,
    weight: ["400"]
});

export default function CreatedCookieList (props: CookieListProps)
{
    const {pageId, boardId} = props;
    const [hasPrev, setHasPrev] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [prevPage, setPrevPage] = useState(1);
    const [nextPage, setNextPage] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [cookieArray, setCookieArray] = useState<CookieContent[]>([{
        messageId: -1,
        sender: '관리자', 
        title: '기본 제공 쿠키', 
        content: '새해 복 많이 받으세요!',
        opened: false,
        createdAt: ''
    }]);

    useEffect(() => {
        if (boardId === 0) return;
        getMessageListAPI(boardId, 1, 6)
        .then((result) => handleMsgListResult(result));
    }, [boardId]);

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
