'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CookieList from "@/components/cookieList";

export default function UserInfo() {
    const [pageId, setPageId] = useState('');
    useEffect(() => {
        const url = new URL(window.location.href);
        const urlParam = url.searchParams.get('id');
        if (urlParam === null) {
            alert('잘못된 접근입니다.');
            redirect('/');
        } else {
            setPageId(urlParam);
        }
    })

    const logout = () => {
        localStorage.removeItem("loginId");
        alert('로그아웃 되었습니다.');
        redirect('/userinfo?id=' + pageId);
    };
    const share = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('내 페이지 주소가 복사되었습니다.');
    };

    const loginId = localStorage.getItem("loginId");
    const isMyPage = loginId === pageId;
    // 네비게이션 추가해서 로그아웃, 내역 보기 등 메뉴 구겨담아야 할 듯

    return(
        <div className="grid grid-rows-[80px_1fr_20px] items-center justify-items-center min-h-screen p-6 pb-10 gap-1">
            <header className="row-start-1 gap-3 items-center justify-center text-center">
                <p className='font-bold text-lg'>{pageId}님의 포춘 쿠키</p>
                { isMyPage ? (
                    <p>원하는 쿠키를 선택하여 열어보세요!</p>
                ) : (
                    <p>{pageId}님에게 쿠키로 덕담을 남겨보세요!</p>
                )}
            </header>
            <div className="flex flex-col row-start-2 items-center w-full h-5/6">
                <CookieList isRevealPossible={isMyPage}/>
            </div>
            <footer className="row-start-3 flex flex-col gap-6 items-center justify-center">
                { isMyPage ? (
                    <div className="flex flex-row gap-3">
                        <Link href="/userinfo/revealItem"><button type="button" className="btn btn-warning">무작위로 뽑기</button></Link>
                        <button type="button" className="btn btn-light" onClick={share}>친구에게 알리기</button>
                    </div>
                ) : (
                    <div className="flex flex-row gap-3">
                        <Link href={'/userinfo/addItem?pageId=' + pageId}><button type="button" className="btn btn-warning">포춘 쿠키 만들어주기</button></Link>
                        <Link href="/login"><button type="button" className="btn btn-light">내 쿠키함 가기</button></Link>
                    </div>
                )}
                { isMyPage && <button className='mx-4' onClick={logout}>로그아웃</button> }
            </footer>
        </div>
    );
}