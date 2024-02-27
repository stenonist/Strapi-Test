export interface Post{
    id: number,
    attributes:{
        title: string,
        description: string,
        photo: {
            data:{
                attributes:{
                    url: string
                }
            }
        }, /* URL OF PHOTO */
        date: Date,
        /* MYB comments */
        tags: string[],
        authorId: {
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
        author: {connect: number[]|null},
        authorId: number|null
    }
}