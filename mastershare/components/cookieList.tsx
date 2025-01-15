'use client'

import { CookieContent } from "@/lib/type";
import { useRef } from "react";
import CookieImg from "./cookieImg";

interface CookieListProps {
    cookies: Array<CookieContent>,
    isRevealPossible: boolean,
    pageId: string
}

export default function CookieList (props: CookieListProps)
{
    const {cookies, isRevealPossible, pageId} = props;
    // const [height, setHeight] = useState(0);
    // const [width, setWidth] = useState(0);
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

    // 사이즈 파악 용도. 현재 사용 안함. 추후 사용할 수 있어 남겨둠
    // useEffect(() => {
    //     const elem = ref.current;
    //     if (elem) {
    //         const rect = elem.getBoundingClientRect();
    //         setHeight(rect.height);
    //         setWidth(rect.width);
    //     }
    // }, [ref])

    return(
        // component key 할당 제대로 해야 함
        <div ref={ref} className="w-full h-full flex flex-col gap-3 justify-center">
            <div className="flex justify-center gap-3">
                {cookieArray1.map((cookie) => (      
                    <CookieImg key={cookie.messageId} isRevealPossible={isRevealPossible} cookieData={cookie} size={imgSize} pageId={pageId}/>
                ))}
            </div>
            <div className="flex justify-center gap-3">
                {cookieArray2.map((cookie) => (      
                    <CookieImg key={cookie.messageId} isRevealPossible={isRevealPossible} cookieData={cookie} size={imgSize} pageId={pageId}/>
                ))}
            </div>
            <div className="flex justify-center gap-3">
                {cookieArray3.map((cookie) => (      
                    <CookieImg key={cookie.messageId} isRevealPossible={isRevealPossible} cookieData={cookie} size={imgSize} pageId={pageId}/>
                ))}
            </div>
        </div>
    );
}