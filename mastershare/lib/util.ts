import { BoardResult, CreateCookieInput, CreateCookieResult, JoinInput, JoinResult, LoginInput, LoginResult, MsgUpdateResult, MsgListResult, MsgRevealResult, RefreshTokenResult, UpdateMsgInput, UserInfoResult, EditUserInfoInput } from "./type";
import { redirect } from 'next/navigation'
import { serverOrigin } from "./constant";

const preFix = "/api/v1";

const noResponseFailResult = {
    success: false,
    error: {
        code: 0,
        message: "Unknown fetch response error."
    }  
};
const authorizationFailResult = {
    success: false,
    error: {
        code: 401,
        message: "Authorization error."
    }
}

export async function joinAPI(input: JoinInput): Promise<JoinResult> {
    const url = serverOrigin + preFix + "/auth/join";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as JoinResult;
};

export async function loginAPI(input: LoginInput): Promise<LoginResult> {
    const url = serverOrigin + preFix + "/auth/login"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as LoginResult;
};

export async function createMessageAPI(boardId: number, input: CreateCookieInput, accessToken: string): Promise<CreateCookieResult> {
    const url = serverOrigin + preFix + "/boards/" + boardId + "/messages";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(input)
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as CreateCookieResult;
    }
    return noResponseFailResult as CreateCookieResult;
};

export async function createRandomMessageAPI(input: CreateCookieInput, accessToken: string): Promise<CreateCookieResult> {
    const url = serverOrigin + preFix + "/boards/random/messages";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(input)
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as CreateCookieResult;
    }
    return noResponseFailResult as CreateCookieResult;
};

export async function getMessageAPI(msgId: number, accessToken: string): Promise<MsgRevealResult> {
    const url = serverOrigin + preFix + "/messages/" + msgId + "/member";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as MsgRevealResult;
    }
    return noResponseFailResult as MsgRevealResult;
};

export async function getMessageAPIGuest(msgId: number): Promise<MsgRevealResult> {
    const url = serverOrigin + preFix + "/messages/" + msgId + "/guest";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        return response.json();
    } 
    return noResponseFailResult as MsgRevealResult;
};

export async function getRandomMessageAPI(): Promise<MsgRevealResult> {
    const url = serverOrigin + preFix + "/boards/random/messages";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as MsgRevealResult;
}

export async function updateMessageAPI(msgId: number, accessToken: string, input: UpdateMsgInput): Promise<MsgUpdateResult> {
    const url = serverOrigin + preFix + "/messages/" + msgId;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(input)
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as MsgUpdateResult;
    }
    return noResponseFailResult as MsgUpdateResult;
};

export async function getBoardAPI(userKey: string): Promise<BoardResult> {
    const url = serverOrigin + preFix + "/users/" + userKey + "/boards";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as BoardResult;
};

export async function getReceivedMessageListAPI(boardId: number, accessToken: string, page: number, size: number, opened?: boolean, deleted?: boolean): Promise<MsgListResult> {
    const openQuery = (opened !== undefined) ? "&opened=" + opened : "";
    const deleteQuery = (deleted  !== undefined) ? "&deleted=" + deleted : "";
    const url = serverOrigin + preFix + "/boards/" + boardId + "/messages/guest" + "?page=" + page + "&size=" + size + openQuery + deleteQuery;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as MsgListResult;
    }
    return noResponseFailResult as MsgListResult;
};

export async function getReceivedMessageListAPIGuest(boardId: number, page: number, size: number): Promise<MsgListResult> {
    const url = serverOrigin + preFix + "/boards/" + boardId + "/messages/guest" + "?page=" + page + "&size=" + size;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as MsgListResult;
};

export async function getCreatedMessageListAPI(userKey: string, accessToken: string, page: number, size: number, opened?: boolean, deleted?: boolean): Promise<MsgListResult> {
    const openQuery = (opened !== undefined) ? "&opened=" + opened : "";
    const deleteQuery = (deleted  !== undefined) ? "&deleted=" + deleted : "";
    const url = serverOrigin + preFix + "/users/" + userKey + "/messages" + "?page=" + page + "&size=" + size + openQuery + deleteQuery;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as MsgListResult;
    }
    return noResponseFailResult as MsgListResult;
};

export async function getUserInfoAPI(userKey: string, accessToken: string): Promise<UserInfoResult> {
    const url = serverOrigin + preFix + "/users/" + userKey;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as UserInfoResult;
    }
    return noResponseFailResult as UserInfoResult;
}

export async function editUserInfoAPI(userKey: string, accessToken: string, input: EditUserInfoInput): Promise<UserInfoResult> {
    const url = serverOrigin + preFix + "/users/" + userKey;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(input)
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as UserInfoResult;
    }
    return noResponseFailResult as UserInfoResult;
}

export async function refreshTokenAPI(accessToken: string, refreshToken: string): Promise<RefreshTokenResult> {
    const url = serverOrigin + preFix + "/auth/token/refresh?refreshToken=" + refreshToken;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as RefreshTokenResult;
    }
    return noResponseFailResult as RefreshTokenResult;
}

export function handleRefreshTokenSuccess(result: RefreshTokenResult): string {
    const newAccessToken = result.data.accessToken;
    const newRefreshToken = result.data.refreshToken;
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return newAccessToken;
}

export function handleRefreshTokenFail(): void {
    alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
    logoutLocalStorage();
    redirect('/login');
}

export function logoutLocalStorage(): void {
    localStorage.removeItem("userId");
    localStorage.removeItem("nickName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}