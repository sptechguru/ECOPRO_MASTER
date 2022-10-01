
export interface UserListQueryModel {
    page: number;
    query?: string | Array<string> | any;
    sortFied: string;
    orderBy: string;
    status: string;
    user_type: string;
}