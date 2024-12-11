'use client'

import { useState } from "react";
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface LogInResult {
    success: boolean,
    message: string
}

export default function Login() {
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');

    const onPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }
    const onUserNameHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setUserName(event.currentTarget.value);
    }
    const handleLoginResult = (result: LogInResult) => {
        console.log(result);
        if (result.success) {
            redirect('/myinfo?id='+userName);
        } else {
            alert('아이디, 혹은 비밀번호를 다시 한 번 확인해주세요.');
        }
    };
    const login = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        fetch("http://localhost:8080/auth/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userName,
                password: password,
            }),
          })
          .then((response) => response.json())
          .then((result) => handleLoginResult(result));
    };
    return(
        <div>
            <div className='flex flex-col justify-center items-center w-full h-screen'>
                <form className='flex flex-col'>
                    <label>아이디: </label>
                    <input className='border-2' type='text' onChange={onUserNameHandler}/> <br/>
                    <label>비밀번호: </label>
                    <input className='border-2' type='password' onChange={onPasswordHandler}/> <br/>
                </form>
                <div>
                    <button className='mx-4' onClick={login}>로그인</button>
                    <Link className='mx-4' href='/join'>회원가입</Link>
                </div>
            </div>
        </div>
    );
}