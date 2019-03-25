export interface UserProfile {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    mobile_no: string;
    password: string;
    id: number;
}

export interface EditUser {
    username:string;
    email: string;
    first_name: string;
    last_name: string;
    contactNo: string;
}

export interface changePassword {
    currentPassword: string;
    password1: string;
    password2: string;
}

export interface Reset {
    password1:string;
    password2:string;
}

export interface resetPassword {
    password:string;
    uid:string;
    token:string;
}