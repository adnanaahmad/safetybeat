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
    email: string;
    first_name: string;
    last_name: string;
    mobile_no: string;
}

export interface changePassword {
    currentPassword: string;
    password1: string;
    password2: string;
}
