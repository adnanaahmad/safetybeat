export interface RequestObject {
  id: number,
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  contactNo: string,
  profileImage: string,
  is_active: boolean
}

export interface NotificationList {
  data: {
    requestsList: Array<RequestObject>
  },
  responseDetails: {
    code: number,
    message: string
  }
}

export interface DirectObject {
  image: string,
  message: string,
  time: string,
  type: string,
  user: User
}

export interface User {
  contactNo: string,
  email: string,
  first_name: string,
  id: number,
  is_active: boolean,
  last_name: string,
  profileImage: string,
  username: string,
}

export interface DirectNotificationList {
  data: {
    notifications: Array<DirectObject>
  },
  responseDetails: {
    code: number,
    message: string
  }
}
