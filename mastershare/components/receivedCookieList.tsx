'use client'

import { CookieContent } from "@/lib/type";
import { useRef } from "react";
import CookieImg from "./cookieImg";

interface CookieListProps {
    cookies: Array<CookieContent>,
    pageId: string | null
}

export default function ReceivedCookieList (props: CookieListProps)
{
    const {cookies, pageId} = props;
    const ref = useRef<HTMLDivElement>(null);
    
    const imgSize = 100;
    const cookieArray1 = [];
    const cookieArray2 = [];
    const cookieArray3 = [];
    for (let i = 0; i < cookies.length; i++) {
        if (i < 2) {
            cookieArray1.push(cookies[i]);
        } else if (i < 4) {
            cookieArray2.push(cookies[i]);
        } else if (i < 6) {
            cookieArray3.push(cookies[i]);
        } else {
            break;
        }
    }

    return(
        // component key 할당 제대로 해야 함
        <div ref={ref} className="w-full h-full flex flex-col gap-3 justify-center">
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
        </div>
    );
}