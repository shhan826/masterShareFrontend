'use client'

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface LogInResult {
    success: boolean,
    message: string,
    userInfo: {
        userId: string,
        username: string,
        email: string,
        nickname: string
    },
    accessToken: string,
    refreshToken: string
}

export default function Login() {
    const [password, setPassword] = useState('');
    const [id, setId] = useState('');

    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken') as string;

    // 이미 로그인 되어 있는 경우, userinfo로 바로 이동
    useEffect(() => {
        if (accessToken !== null && userId !== null && userId !== '') {
            redirect('/userinfo?pageid=' + userId);
        }
    }, []);

    const onPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }
    const onIdHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setId(event.currentTarget.value);
    }
    const onLoginEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            login(event);
        }
    }
    const handleLoginResult = (result: LogInResult) => {
        if (result.success) {
            const userInfo = result.userInfo;
            localStorage.setItem("userId", userInfo.userId);
            localStorage.setItem("nickName", userInfo.nickname);
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken);
            redirect('/userinfo?pageid=' + userInfo.userId);
        } else {
            alert('아이디, 혹은 비밀번호를 다시 한 번 확인해주세요.');
        }
    };
    const checkInputInfo = () => {
        if (id === '') {
            alert('아이디를 입력해주세요.');
            return false;
        } else if (password === '') {
            alert('비밀번호를 입력해주세요.');
            return false;
        }
        return true;
    }
    const login = (event: React.FormEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (checkInputInfo() === false) return;
        fetch("http://localhost:8080/auth/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Athorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                username: id,
                password: password,
            }),
          })
          .then((response) => response.json())
          .then((result) => handleLoginResult(result));
    };

    return(
        <div>
            <div className='flex flex-col justify-center items-center w-full h-screen'>
                <h3 className='font-bold'>로그인</h3><br/>
                <form className='flex flex-col'>
                    <label>아이디: </label>
                    <input className='border-2 rounded-md' type='text' onChange={onIdHandler} onKeyDown={onLoginEnter}/> <br/>
                    <label>비밀번호: </label>
                    <input className='border-2 rounded-md' type='password' onChange={onPasswordHandler} onKeyDown={onLoginEnter}/> <br/>
                </form>
                <div>
                    <button className='mx-3 btn btn-primary btn-sm' onClick={login}>로그인</button>
                    <Link className='mx-3 btn btn-secondary btn-sm' href='/join'><button>회원 가입</button></Link>
                </div>
            </div>
        </div>
    );
}