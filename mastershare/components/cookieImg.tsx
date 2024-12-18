'use client'

import Image from "next/image";
import Link from 'next/link'
import { MouseEventHandler, useEffect, useRef } from "react";

interface ImgProps {
    subject: string,
    size: number,
    isRevealPossible: boolean,
}

export default function CookieImg (props: ImgProps)
{
    const link = props.isRevealPossible ? '/userinfo/revealItem?id=' + props.subject : '';
    const animate = (event: any) => {
        const target = event.target.parentElement;
        if (target.className === 'animateTarget') {
            target.className = 'rotate';
            setTimeout(() => {
                target.className = 'animateTarget';
            }, 3000);
        }
    };
    return(
        <Link href={link} className="relative">
            <div className='animateTarget' onMouseOver={animate}>    
                <Image
                    key={props.subject}
                    src="/mainImage.png"
                    alt="main image"
                    width={props.size}
                    height={props.size}
                />
                <div className="absolute left-1/2 top-1">{props.subject}</div>
            </div>
        </Link>
    );
}