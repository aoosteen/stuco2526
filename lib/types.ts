export interface BlogType{
    title: string;
    author:string,
    coverImage:any,
    image: any;
    tags:string[],
    _createdAt:any,
    description:string,
    _updatedAt:any,
    _id:any,
    blog:any
}

export interface FilterProps{
    tag?:string[],
    order?:string,
    page?:number,
    search?:string,
    cursor?:string,
    letter:string
}