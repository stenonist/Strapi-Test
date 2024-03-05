export interface Post{
    id: number,
    attributes:{
        title: string,
        description: string,
        photo: {
            data:{
                id: number,
                attributes:{
                    url: string
                }
            }
        }, /* URL OF PHOTO */
        date: Date,
        /* MYB comments */
        tags: string[],
        theAuthor: {
            data:{
                id:number
            }
        },
    }
}
export interface PostGet{
    id: number,
    attributes:{
        title: string,
        description: string,
        photo: {
            data:{
                id: number,
                attributes:{
                    url: string
                }
            }
        }, /* URL OF PHOTO */
        date: Date,
        /* MYB comments */
        tags: string[],
        theAuthor: {
            data:{
                id:number
            }
        },
    }
}
export interface PostUpdate{
    data:{
        id: string,
        title: string,
        description:string
    }
}
export interface PostAdd{
    data:{
        title: string,
        description: string,
        photo: any,
        date: number,
        theAuthor: {
            connect?: number[]|null,
            disconnect?: number[]|null,
        },
    }
}