export interface UserCreateDTO {
  email: string;
  password: string;
  name?: string;
}

export interface UserUpdateDTO {
  email?: string;
  password?: string;
  name?: string;
}
