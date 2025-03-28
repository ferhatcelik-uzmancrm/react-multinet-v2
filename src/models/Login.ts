export interface LoginRequestModel {
  username: string;
  password: string;
  captchaToken?: string;
}

export type UserModel = {
  user: string;
  userid: string;
  brand: string;
  brandid: string;
  cityid: string;
  cityname: string;
};

export type ForgotPasswordRequestModel = {
  email: string;
  password: string;
};
