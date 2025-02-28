interface ResultBase {
    success: boolean,
    error: {
        code: number,
        message: string
    }
};

interface UserInfo {
    userKey: string,
    username: string,
    email: string,
    nickname: string
};
interface UserInfoData {
    data: UserInfo
};
interface JoinData {
    data: {
        userInfo: UserInfo,
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
        messageId: number,
        sender: string,
        title: string,
        content: string,
        opend: boolean,
        deleted: boolean,
        createdAt: string
    }
};
interface MsgRevealData {
    data: {
        messageId: number,
        sender: string,
        title: string,
        content: string,
        opened: boolean,
        createdAt: string
    }
};
interface MsgUpdateData {
    data: {
        messageId: number,
        sender: string,
        title: string,
        content: string,
        opened: boolean,
        createdAt: string
    }
};
export interface CookieContent {
    messageId: number,
    sender: string,
    title: string,
    content: string,
    opened: boolean,
    isPublic: boolean,
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
        boards: [
            {
                boardId: number,
                maxSize: number
            }
        ]
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
export type MsgUpdateResult = ResultBase & MsgUpdateData;
export type MsgListResult = ResultBase & MsgListData;
export type BoardResult = ResultBase & BoardData;
export type RefreshTokenResult = ResultBase & RefreshTokenData;
export type UserInfoResult = ResultBase & UserInfoData;

export interface JoinInput {
    username: string,
    password: string,
    email: string,
    nickname: string
};
export interface EditUserInfoInput {
    email: string,
    nickname: string
}
export interface LoginInput {
    username: string,
    password: string
};
export interface CreateCookieInput {
    sender: string,
    title: string,
    content: string,
    isPublic: boolean
};
export interface UpdateMsgInput {
    title?: string,
    content?: string,
    opened?: boolean,
    deleted?: boolean,
};