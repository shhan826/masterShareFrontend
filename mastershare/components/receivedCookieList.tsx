'use client'

import { CookieContent, MsgListResult } from "@/lib/type";
import { getReceivedMessageListAPI } from "@/lib/util";
import { useEffect, useState } from "react";
import CookieImg from "./cookieImg";

interface CookieListProps {
    pageId: string | null
    boardId: number
}

export default function ReceivedCookieList (props: CookieListProps)
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
        isPublic: true,
        createdAt: ''
    }]);
    const imgSize = 95;
    const cookieArray1 = [];
    const cookieArray2 = [];
    const cookieArray3 = [];
    for (let i = 0; i < cookieArray.length; i++) {
        if (i < 2) {
            cookieArray1.push(cookieArray[i]);
        } else if (i < 4) {
            cookieArray2.push(cookieArray[i]);
        } else if (i < 6) {
            cookieArray3.push(cookieArray[i]);
        } else {
            break;
        }
    }

    useEffect(() => {
        if (boardId === 0) return;
        getReceivedMessageListAPI(boardId, 1, 6)
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
        getReceivedMessageListAPI(boardId, prevPage, 6)
        .then((result) => handleMsgListResult(result));
    };
    const moveNextPage = () => {
        if (hasNext === false || boardId === 0) return;
        getReceivedMessageListAPI(boardId, nextPage, 6)
        .then((result) => handleMsgListResult(result));
    };

    return(
        <div className="w-full h-full flex flex-col gap-3 justify-center">
            <div className="flex justify-center gap-3">
                {cookieArray1.map((cookie) => (      
                    <CookieImg key={cookie.messageId} cookieData={cookie} size={imgSize} pageId={pageId}/>
                ))}
            </div>
            <div className="flex justify-center gap-3">
                {cookieArray2.map((cookie) => (      
                    <CookieImg key={cookie.messageId} cookieData={cookie} size={imgSize} pageId={pageId}/>
                ))}
            </div>
            <div className="flex justify-center gap-3">
                {cookieArray3.map((cookie) => (      
                    <CookieImg key={cookie.messageId} cookieData={cookie} size={imgSize} pageId={pageId}/>
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
