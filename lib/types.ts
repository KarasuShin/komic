export interface TaskItem {
    chapter_name: string
    page_url: string[]
}


export interface ChapterItem {
    id: string
    comic_id: string
}

export interface ComicInfo {
    id: number
    comic_name: string
    comic_author: string
    comic_cover: string
    cover: string
    last_update_chapter_name: string
    comic_url_raw:string
    comic_url: string
    status:string
    chapter_url_raw:string
    chapter_url: string
}
