import { BoardResult, CreateCookieInput, CreateCookieResult, JoinInput, JoinResult, LoginInput, LoginResult, MsgDeleteResult, MsgListResult, MsgOpenResult, MsgRevealResult, RefreshTokenResult } from "./type";

// 로털 테스트용 URL Origin. 배포 후 변경 필요
const originURL = "http://localhost:8080";
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
    const url = originURL + "/auth/v1/join"
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
    const url = originURL + "/auth/v1/login"
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

export async function createMessageAPI(pageId: string, input: CreateCookieInput): Promise<CreateCookieResult> {
    const url = originURL + "/boards/v1/" + pageId + "/board/message/new";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input)
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as CreateCookieResult;
};

export async function getMessageAPI(msgId: string, accessToken: string): Promise<MsgRevealResult> {
    const url = originURL + "/boards/v1/message/" + msgId;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as MsgRevealResult;
};

export async function deleteMessageAPI(msgId: string, accessToken: string): Promise<MsgDeleteResult> {
    const url = originURL + "/boards/v1/message/delete/" + msgId;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as MsgDeleteResult;
};

export async function getBoardAPI(pageId: string): Promise<BoardResult> {
    const url = originURL + "/boards/v1/" + pageId + "/board";
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

export async function getMessageListAPI(pageId: string, page: number, size: number): Promise<MsgListResult> {
    const url = originURL + "/boards/v1/" + pageId + "/board/messages?page=" + page + "&size=" + size;
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

export async function openMessageAPI(msgId: string, accessToken: string): Promise<MsgOpenResult> {
    const url = originURL + "/boards/v1/message/open/" + msgId;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        return response.json();
    } else if (response.status === 401) {
        return authorizationFailResult as MsgOpenResult;
    }
    return noResponseFailResult as MsgOpenResult;
};

export async function refreshTokenAPI(accessToken: string, refreshToken: string): Promise<RefreshTokenResult> {
    const url = originURL + "/auth/v1/token/refresh?refreshToken=" + refreshToken;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        return response.json();
    }
    return noResponseFailResult as RefreshTokenResult;
}