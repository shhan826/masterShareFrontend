interface ResultBase {
    success: boolean,
    error: {
        code: number,
        message: string
    }
};

interface JoinData {
    data: {
        userInfo: {
            userKey: string,
            username: string,
            email: string,
            nickname: string
        },
        accessToken: string,
        refreshToken: string
    }
};
interface LoginData {
    data: {
        userInfo: {
            userKey: string,
            username: string,
            email: string,
            nickname: string
        },
        accessToken: string,
        refreshToken: string
    }
};
interface CreateCookieData {
    data: {
        messageKey: string,
        sender: string,
        title: string,
        opend: boolean,
        createdAt: string
    }
};
interface MsgRevealData {
    data: {
        messageKey: string,
        sender: string,
        title: string,
        content: string,
        opened: boolean,
        createdAt: string
    }
};
interface MsgDeleteData {
    data: {
        messageKey: string
    }
};
export interface CookieContent {
    messageKey: string,
    sender: string,
    title: string,
    opened: boolean,
    createdAt: string,
};
interface MsgListData {
    data: {
        dataList: [CookieContent],
        pageRequest: {
            page: number,
            size: number
        },
        hasPrev: boolean,
        hasNext: boolean,
        totalDataCount: number,
        currentPage: number,
        prevPage: number,
        nextPage: number,
        lastPage: number
    }
};
interface BoardData {
    data: {
        username: string,
        nickname: string,
        maxSize: number
    }
};
interface MsgOpenData {
    data: {
        messageKey: string,
        sender: string,
        title: string,
        content: string,
        opened: boolean,
        createdAt: string
    }
};
interface RefreshTokenData {
    data: {
        accessToken: string,
        refreshToken: string
    }
};

export type JoinResult = ResultBase & JoinData;
export type LoginResult = ResultBase & LoginData;
export type CreateCookieResult = ResultBase & CreateCookieData;
export type MsgRevealResult = ResultBase & MsgRevealData;
export type MsgDeleteResult = ResultBase & MsgDeleteData;
export type MsgListResult = ResultBase & MsgListData;
export type BoardResult = ResultBase & BoardData;
export type MsgOpenResult = ResultBase & MsgOpenData;
export type RefreshTokenResult = ResultBase & RefreshTokenData;

export interface JoinInput {
    username: string,
    password: string,
    email: string,
    nickname: string
};
export interface LoginInput {
    username: string,
    password: string
};
export interface CreateCookieInput {
    sender: string,
    title: string,
    content: string
};