export interface Response<T> {
    statusCode: number;

    data: T;

    message: string;
}