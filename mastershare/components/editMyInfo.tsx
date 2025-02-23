'use client'

import { useState } from "react";
import Link from 'next/link'

export default function EditMyInfo() {
    const [password, setPassword] = useState('');
    const [id, setId] = useState('');

    const onPasswordHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    }
    const onIdHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setId(event.currentTarget.value);
    }

    return(
        <div>
            <div className='flex flex-col justify-center items-center w-full h-dvh'>
                <form className='flex flex-col'>
                    <label>아이디: </label>
                    <input className='border-2 rounded-md' type='text' onChange={onIdHandler}/> <br/>
                    <label>비밀번호: </label>
                    <input className='border-2 rounded-md' type='password' onChange={onPasswordHandler}/> <br/>
                </form>
                <div>
                    <button className='mx-3 btn btn-primary btn-sm'>정보 수정</button>
                    <Link className='mx-3 btn btn-secondary btn-sm' href='/join'><button>로그아웃</button></Link>
                </div>
            </div>
        </div>
    );
}