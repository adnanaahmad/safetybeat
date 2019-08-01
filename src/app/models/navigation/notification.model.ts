export interface RequestObject {
    "user": {
        "id": number,
        "username": string,
        "email": string,
        "first_name": string,
        "last_name": string,
        "contactNo": string,
        "profileImage": string,
        "is_active": boolean
    }
}

export interface NotificationList {
    "data": {
        "Requests": Array<RequestObject>           
    },
    "responseDetails": {
        "code": number,
        "message": string
    }
}