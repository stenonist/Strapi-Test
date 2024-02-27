import { Post } from "./post"
import { User } from "./user"

export interface StrapiResponsePost{
    data: Post[],
    meta?:{
        pagination:{
            page: number,
            pageCount: number,
            pageSize: number,
            total: number,
        }
    },
    error?: {
        details:{},
        message: string,
        name: string,
        status: string
    }
}
export interface StrapiResponseUser{
    data: User[],
    meta?:{
        pagination:{
            page: number,
            pageCount: number,
            pageSize: number,
            total: number,
        }
    },
    error?: {
        details:{},
        message: string,
        name: string,
        status: string
    }
}