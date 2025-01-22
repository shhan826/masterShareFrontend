'use client'

import { useState } from "react";
import { redirect } from 'next/navigation'
import { JoinInput, JoinResult } from "@/lib/type";
import { joinAPI } from "@/lib/util";

// 회원 정보 수정 페이지도 만들면 좋을 듯
export default function Join() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [nickName, setNickName] = useState('');
    const [email, setEmail] = useState('');
    
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
        } else if (nickName === '') {
            alert('이름(닉네임)을 입력해주세요.');
            return false;
        }
        return true;
    }
    const handleJoinResult = (result: JoinResult) => {
        const resultData = result.data;
        if (result.success && resultData) {
            alert('가입이 완료되었습니다.');
            const userInfo = resultData.userInfo;
            localStorage.setItem("userId", userInfo.userKey);
            localStorage.setItem("nickName", userInfo.nickname);
            localStorage.setItem("accessToken", resultData.accessToken);
            localStorage.setItem("refreshToken", resultData.refreshToken);
            redirect('/login');
        } else {
            alert('이미 동일한 아이디로 가입된 계정이 있습니다. 다른 아이디로 가입해주세요.');
        }
    };
    const join = (event: React.FormEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (checkInputInfo() === false) return;

        const input: JoinInput = {
            username: id,
            password: password,
            email: email,
            nickname: nickName
        };
        joinAPI(input)
        .then(result => handleJoinResult(result));
    };

    return(
        <div>
            <div className='flex flex-col justify-center items-center w-full h-dvh'>
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