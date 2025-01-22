class ApiError{
    statusCode: number;
    message: string;
    errors?: string[];

    constructor(statusCode: number, message: string, errors?: string[]){
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
    }
}

export default ApiError;