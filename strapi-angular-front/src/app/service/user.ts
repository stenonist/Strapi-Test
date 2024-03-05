export interface User{
    id: number;
    username: string,
    firstname: string;
    lastname: string;
    profilePic: {
        url: string
    },
    email: string;
    password: string;
    tags: string[];
    following: [];
    followers: [];
}
export interface UserCreate{
    username: string,
    firstname: string;
    lastname: string;
    // profilePic: any,
    email: string;
    password: string;
    tags: string[];
    following: [];
    followers: [];
}
export interface UserUpdate{
    id: number,
    following?: {connect?: number[]|null, disconnect?: number[]|null}
    followers?: {connect: number[]|null, disconnect?: number[]|null}
}
export interface regSuccess{
    jwt: string,
    user: {
        id:number
    }
}