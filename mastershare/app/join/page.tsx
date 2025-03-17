'use client'

import { useEffect, useState } from "react";
import { redirect, useSearchParams } from 'next/navigation'
import { JoinInput, JoinResult } from "@/lib/type";
import { joinAPI } from "@/lib/util";
import koTranslation from '../../locales/ko/common.json';
import enTranslation from '../../locales/en/common.json';

// TODO: 로그인 한 상태에서 들어오면 회원 정보 수정으로 작동하게 수정
export default function Join() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nickName, setNickName] = useState('');
    const [email, setEmail] = useState('');
    const [translation, setTranslation] = useState(koTranslation);
    const [isClient, setIsClient] = useState(false);

    const searchParams = useSearchParams();
    const targetParam = searchParams.get('target')
    const targetUrl = targetParam ? decodeURIComponent(targetParam) : '';

    let lang = '';
    if (isClient) {
        lang = localStorage.getItem('lang') || window.navigator.language || '';
    }

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (lang === 'ko' || lang === 'ko-KR') {
            setTranslation(koTranslation);
        } else {
            setTranslation(enTranslation);
        }
    }, [lang]);
      
    const onIdHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setId(event.currentTarget.value);
    }
    const onPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }
    const onPasswordConfirmHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPasswordConfirm(event.currentTarget.value);
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
            alert(translation.login["id-fail-1"]);
            return false;
        } else if (password === '') {
            alert(translation.login["password-fail-1"]);
            return false;
        } else if (password != passwordConfirm) {
            alert(translation.login["password-fail-2"]);
            return false;
        } else if (email === '') {
            alert(translation.login["email-fail"]);
            return false;
        } else if (nickName === '') {
            alert(translation.login["name-fail"]);
            return false;
        }
        return true;
    }
    const handleJoinResult = (result: JoinResult) => {
        const resultData = result.data;
        if (result.success && resultData) {
            alert(translation.login["join-success"]);
            const userInfo = resultData.userInfo;
            localStorage.setItem("userId", userInfo.userKey);
            localStorage.setItem("nickName", userInfo.nickname);
            localStorage.setItem("accessToken", resultData.accessToken);
            localStorage.setItem("refreshToken", resultData.refreshToken);
            if (targetUrl && targetUrl !== '') {
                redirect(targetUrl);
            } else {
                redirect('/login');
            }
        } else {
            alert(translation.login["id-fail-2"]);
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
            <div className='flex flex-col justify-center items-center w-full min-h-dvh'>
                <h3 className='font-bold'>{translation.login.join}</h3><br/>
                <form className='flex flex-col'>
                    <label>{translation.login.id}: </label>
                    <input className='border-2 rounded-md' type='text' onChange={onIdHandler} onKeyDown={onJoinEnter}/> <br/>
                    <label>{translation.login.password}: </label>
                    <input className='border-2 rounded-md' type='password' onChange={onPasswordHandler} onKeyDown={onJoinEnter}/> <br/>
                    <label>{translation.login["password-confirm"]}: </label>
                    <input className='border-2 rounded-md' type='password' onChange={onPasswordConfirmHandler} onKeyDown={onJoinEnter}/> <br/>
                    <label>{translation.login.email}: </label>
                    <input className='border-2 rounded-md' type='email' onChange={onEmailHandler} onKeyDown={onJoinEnter}/> <br/>
                    <label>{translation.login.name}: </label>
                    <input className='border-2 rounded-md' type='text' onChange={onNickNameHandler} onKeyDown={onJoinEnter}/> <br/>
                </form>
                <button className='btn btn-primary btn-sm' onClick={join}>{translation.login.join}</button>
            </div>
        </div>
    );
}