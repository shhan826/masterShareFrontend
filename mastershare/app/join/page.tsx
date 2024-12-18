'use client'

import { useState } from "react";
import { redirect } from 'next/navigation'

interface JoinResult {
    success: boolean,
    message: string
}

export default function Join() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const onUserIdHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setUserId(event.currentTarget.value);
    }
    const onPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }
    const onEmailHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event?.currentTarget.value);
    }
    const handleJoinResult = (result: JoinResult) => {
        if (result.success) {
            localStorage.setItem("loginId", userId);
            redirect('/userinfo?id=' + userId);
        } else {
            alert('이미 동일한 아이디로 가입된 계정이 있습니다. 다른 아이디로 가입해주세요.');
        }
    };
    const checkInputInfo = () => {
        if (userId === '') {
            alert('아이디를 입력해주세요.');
            return false;
        } else if (password === '') {
            alert('비밀번호를 입력해주세요');
            return false;
        } else if (email === '') {
            alert('이메일 주소를 입력해주세요.');
            return false;
        }
        return true;
    }
    const join = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (checkInputInfo() === false) return;
        fetch("http://localhost:8080/auth/v1/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userId,
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
                <h3 className='font-bold'>회원 가입</h3><br/>
                <form className='flex flex-col'>
                    <label>아이디: </label>
                    <input className='border-2 rounded-md' type='text' onChange={onUserIdHandler}/> <br/>
                    <label>비밀번호: </label>
                    <input className='border-2 rounded-md' type='password' onChange={onPasswordHandler}/> <br/>
                    <label>이메일: </label>
                    <input className='border-2 rounded-md' type='email' onChange={onEmailHandler}/> <br/>
                </form>
                <button className='btn btn-primary btn-sm' onClick={join}>회원 가입</button>
            </div>
        </div>
    );
}