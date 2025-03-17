'use client'

import { useEffect, useState } from "react";
import { redirect, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LoginInput, LoginResult } from "@/lib/type";
import { loginAPI } from "@/lib/util";
import CloseX from "@/components/closeX";
import koTranslation from '../../locales/ko/common.json';
import enTranslation from '../../locales/en/common.json';

export default function Login() {
    const [password, setPassword] = useState('');
    const [id, setId] = useState('');
    const [translation, setTranslation] = useState(koTranslation);

    const searchParams = useSearchParams();
    const targetParam = searchParams.get('target')
    const targetUrl = targetParam ? decodeURIComponent(targetParam) : '';

    let userId = '';
    let lang = '';
    if (typeof window !== 'undefined') {
        userId = localStorage.getItem('userId') || '';
        lang = localStorage.getItem('lang') || window.navigator.language || '';
    }

    // 이미 로그인 되어 있는 경우, userinfo로 바로 이동
    useEffect(() => {
        if (userId && userId !== '') {
            redirect('/userinfo?pageId=' + userId);
        }
    }, [userId]);
    useEffect(() => {
        if (lang === 'ko' || lang === 'ko-KR') {
            setTranslation(koTranslation);
        } else {
             setTranslation(enTranslation);
        }
      }, [lang]);

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
    const checkInputInfo = () => {
        if (id === '') {
            alert(translation.login["id-fail-1"]);
            return false;
        } else if (password === '') {
            alert(translation.login["password-fail-1"]);
            return false;
        }
        return true;
    }
    const handleLoginResult = (result: LoginResult) => {
        const resultData = result.data;
        if (result.success && resultData) {
            const userInfo = resultData.userInfo;
            if (typeof window !== 'undefined') {
                localStorage.setItem("userId", userInfo.userKey);
                localStorage.setItem("nickName", userInfo.nickname);
                localStorage.setItem("accessToken", resultData.accessToken);
                localStorage.setItem("refreshToken", resultData.refreshToken);
            }
            if (targetUrl && targetUrl !== '') {
                redirect(targetUrl);
            } else {
                redirect('/userinfo?pageId=' + userInfo.userKey);
            }
        } else {
            alert(translation.login["login-fail"]);
        }
    };
    const login = (event: React.FormEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (checkInputInfo() === false) return;

        const input: LoginInput = {
            username: id,
            password: password
        };
        loginAPI(input)
        .then(result => handleLoginResult(result));
    };

    return(
        <div>
            <div className='absolute w-full text-right z-2'>
                <CloseX backURL={(targetUrl && targetUrl !== '') ? targetUrl : '/'}/>
            </div>
            <div className='flex flex-col justify-center items-center w-full h-dvh'>
                <h5 className='font-bold'>{translation.login["login-title"]}</h5><br/>
                <form className='flex flex-col'>
                    <label>{translation.login.id}: </label>
                    <input className='border-2 rounded-md' type='text' onChange={onIdHandler} onKeyDown={onLoginEnter}/> <br/>
                    <label>{translation.login.password}: </label>
                    <input className='border-2 rounded-md' type='password' onChange={onPasswordHandler} onKeyDown={onLoginEnter}/> <br/>
                </form>
                <div>
                    <button className='mx-3 btn btn-primary btn-sm' onClick={login}>{translation.login.login}</button>
                    <Link className='mx-3 btn btn-secondary btn-sm' href={(targetUrl && targetUrl !== '') ? '/join?target=' + encodeURIComponent(targetUrl) : '/join'}><button>{translation.login.join}</button></Link>
                </div>
            </div>
        </div>
    );
}