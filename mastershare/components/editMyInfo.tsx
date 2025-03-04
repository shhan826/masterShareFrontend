'use client'
import { TAB } from '@/lib/constant';
import { EditUserInfoInput, RefreshTokenResult, UserInfoResult } from '@/lib/type';
import { editUserInfoAPI, getUserInfoAPI, handleRefreshTokenFail, handleRefreshTokenSuccess, logoutLocalStorage, refreshTokenAPI } from '@/lib/util';
import { redirect } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react';

export default function EditMyInfo() {
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [nickName, setNickName] = useState('');
    const [isClient, setIsClient] = useState(false);

    let accessToken = '';
    let refreshToken = '';
    let userId = '';
    if (isClient) {
        accessToken = localStorage.getItem('accessToken') || '';
        refreshToken = localStorage.getItem('refreshToken') || '';
        userId = localStorage.getItem("userId") || '';
    }
 
    const setUserInfo = useCallback((result: UserInfoResult) => {
        const resultData = result.data;
        setId(resultData.username);
        setEmail(resultData.email);
        setNickName(resultData.nickname);
    }, []);
    const handleRefreshTokenOnUserInfo = useCallback((result: RefreshTokenResult) => {
        if (result.success) {
            const newAccessToken = handleRefreshTokenSuccess(result);
            getUserInfoAPI(userId, newAccessToken)
            .then((result) => {
                if (result.success) {
                    setUserInfo(result);
                } else {
                    alert('잘못된 접근입니다.');
                }
            });
        } else {
            handleRefreshTokenFail();
        }
    }, [userId, setUserInfo]);
    const handleUserInfoResult = useCallback((result: UserInfoResult) => {
        if (result.success === false && result.error.code === 401) {
            refreshTokenAPI(accessToken, refreshToken)
            .then((result) => handleRefreshTokenOnUserInfo(result));
        } else if (result.success === true) {
            setUserInfo(result);
        }
    }, [accessToken, refreshToken, handleRefreshTokenOnUserInfo, setUserInfo]);
    const logout = () => {
        logoutLocalStorage();
        alert('로그아웃 되었습니다.');
        redirect('/');
    };
    const onNickNameHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setNickName(event.currentTarget.value);
    }
    const onEmailHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event?.currentTarget.value);
    }
    const editUserInfo = () => {
        const input: EditUserInfoInput = {
            email: email,
            nickname: nickName
        };
        editUserInfoAPI(userId, accessToken, input)
        .then(result => handleEditUserInfo(input, result));
    };
    const handleEditUserInfo = (input: EditUserInfoInput, result: UserInfoResult) => {
        if (result.success === false && result.error.code === 401) {
            refreshTokenAPI(accessToken, refreshToken)
            .then((result) => handleRefreshTokenOnEditUserInfo(input, result));
        } else if (result.success === true) {
            localStorage.setItem("nickName", result.data.nickname);
            alert('회원 정보가 정상적으로 수정되었습니다.');
            redirect('/userinfo?pageId=' + userId + '&tab=' + TAB.MYINFO);
        }
    };
    const handleRefreshTokenOnEditUserInfo = (input: EditUserInfoInput, result: RefreshTokenResult) => {
        if (result.success) {
            const newAccessToken = handleRefreshTokenSuccess(result);
            editUserInfoAPI(userId, newAccessToken, input)
            .then((result) => {
                if (result.success === true) {
                    localStorage.setItem("nickName", result.data.nickname);
                    alert('회원 정보가 정상적으로 수정되었습니다.');
                    redirect('/userinfo?pageId=' + userId + '&tab=' + TAB.MYINFO);
                }
            })
        } else {
            handleRefreshTokenFail();
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);
    useEffect(() => {
        if (userId === '') return;
        getUserInfoAPI(userId, accessToken)
        .then((result) => handleUserInfoResult(result));
    }, [userId, accessToken, handleUserInfoResult])

    return(
        <div className='w-full h-full flex flex-col justify-center items-center gap-3'>
            <div className='flex flex-row'>
                <div className="p-2"><b>아이디: </b></div>
                <input className="bg-white rounded-md p-2" value={id} readOnly/>
            </div>
            <div className='flex flex-row'>
                <div className="p-2"><b>이메일: </b></div>
                <input className="bg-white rounded-md p-2" type='text' onChange={onEmailHandler} defaultValue={email} />
            </div>
            <div className='flex flex-row'>
                <div className="p-2"><b>이름(닉네임): </b></div>
                <input className="bg-white rounded-md p-2" type='text' onChange={onNickNameHandler} defaultValue={nickName} />
            </div>
            <div className="flex flex-row gap-3">
                <button className="btn btn-secondary btn-sm" onClick={editUserInfo}>정보 수정</button>    
                <button className="btn btn-danger btn-sm" onClick={logout}>로그아웃</button>
            </div>
        </div>
    );
}