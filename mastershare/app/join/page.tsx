'use client'

import { useState } from "react";
import { redirect } from 'next/navigation'

interface JoinResult {
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

export default function Join() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');
    const [email, setEmail] = useState('');

    const accessToken = localStorage.getItem('accessToken') as string;

    const onIdHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setId(event.currentTarget.value);
    }
    const onPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }
    const onNickNameHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setNickName(event.currentTarget.value);
    }
    const onEmailHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event?.currentTarget.value);
    }
    const onJoinEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            join(event);
        }
    }
    const handleJoinResult = (result: JoinResult) => {
        if (result.success) {
            alert('가입이 완료되었습니다. 가입한 정보로 로그인 해주세요.');
            redirect('/login');
        } else {
            alert('이미 동일한 아이디로 가입된 계정이 있습니다. 다른 아이디로 가입해주세요.');
        }
    };
    const checkInputInfo = () => {
        if (id === '') {
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
    const join = (event: React.FormEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (checkInputInfo() === false) return;
        fetch("http://localhost:8080/auth/v1/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Athorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                username: id,
                password: password,
                email: email,
                nickname: nickName
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
                    <input className='border-2 rounded-md' type='text' onChange={onIdHandler} onKeyDown={onJoinEnter}/> <br/>
                    <label>비밀번호: </label>
                    <input className='border-2 rounded-md' type='password' onChange={onPasswordHandler} onKeyDown={onJoinEnter}/> <br/>
                    <label>이메일: </label>
                    <input className='border-2 rounded-md' type='email' onChange={onEmailHandler} onKeyDown={onJoinEnter}/> <br/>
                    <label>이름(닉네임): </label>
                    <input className='border-2 rounded-md' type='text' onChange={onNickNameHandler} onKeyDown={onJoinEnter}/> <br/>
                </form>
                <button className='btn btn-primary btn-sm' onClick={join}>회원 가입</button>
            </div>
        </div>
    );
}