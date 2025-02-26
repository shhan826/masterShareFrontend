'use client'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function EditMyInfo() {
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

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

    // TODO: 회원 정보 받아오는 API 필요
    return(
        <div className='w-full h-full flex flex-col justify-center items-center'>
            <div className='flex flex-row'>
                <div className="p-2"><b>아이디: </b></div>
                <p className="bg-white rounded-md p-2">IDEXAMPLE</p>
            </div>
            <div className='flex flex-row'>
                <div className="p-2"><b>이메일: </b></div>
                <p className="bg-white rounded-md p-2">EMAIL@EXAMPLE.COM</p>
            </div>
            <div className='flex flex-row'>
                <div className="p-2"><b>이름(닉네임): </b></div>
                <p className="bg-white rounded-md p-2">NAMEEXAMPLE</p>
            </div>
            <div>
                <button className="btn btn-danger btn-sm" onClick={logout}>로그아웃</button>
            </div>
        </div>
    );
}