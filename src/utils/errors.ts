export class AppError extends Error {
    statusCode: number | undefined
    errorCode: number | undefined

    constructor(message: string, statusCode?: number, errorCode?: number) {
        super(message)
        this.statusCode = statusCode
        this.errorCode = errorCode
    }
}
