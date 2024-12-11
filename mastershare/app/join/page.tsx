'use client'

import { useState } from "react";
import { redirect } from 'next/navigation'

interface JoinResult {
    success: boolean,
    message: string
}

export default function Join() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');

    const onEmailHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event?.currentTarget.value);
    }
    const onPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }
    const onUserNameHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setUserName(event.currentTarget.value);
    }
    const handleJoinResult = (result: JoinResult) => {
        console.log(result);
        if (result.success) {
            redirect('/myinfo?id='+userName);
        } else {
            alert('이미 동일한 아이디로 가입된 계정이 있습니다. 다른 아이디로 가입해주세요.');
        }
    };
    const join = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        fetch("http://localhost:8080/auth/v1/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userName,
                password: password,
                email: email
            }),
          })
          .then((response) => response.json())
          .then((result) => handleJoinResult(result));
    };
    return(
        <div>
            <div className='flex flex-col justify-center items-center w-full h-screen'>
                <form className='flex flex-col'>
                    <label>아이디: </label>
                    <input className='border-2' type='text' onChange={onUserNameHandler}/> <br/>
                    <label>비밀번호: </label>
                    <input className='border-2' type='password' onChange={onPasswordHandler}/> <br/>
                    <label>이메일: </label>
                    <input className='border-2' type='email' onChange={onEmailHandler}/> <br/>
                </form>
                <button onClick={join}>회원 가입</button>
            </div>
        </div>
    );
}