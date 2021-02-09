export interface ITokenHeaders {
  ['content-type']: string;
  ['access-token']: string;
  client: string;
  uid: string;
}
export interface IUser {
  ['allow_password_change']?: false;
  email: string;
  id: number;
  image: { url: string | null };
  name: string;
  nickname: string;
  ['created_at']: string;
  reword?: IReword;
  birthday: string | null;
  gender: number | null;
  introduction: string | null;
}
export interface IReword {
  ['2']: { total: number; success: number };
  ['3']: { total: number; success: number };
  ['4']: { total: number; success: number };
  ['5']: { total: number; success: number };
  ['6']: { total: number; success: number };
  ['7']: { total: number; success: number };
  ['8']: { total: number; success: number };
  ['9']: { total: number; success: number };
  ['10']: { total: number; success: number };
  score: number;
  total: number;
}
export interface ISignInFormValues {
  email: string;
  password: string;
}
export interface ISignUpFormValues extends ISignInFormValues {
  name: string;
  passwordConfirmation: string;
}
export interface IUserSuccessResponse {
  data: IUser;
  message: string;
}
export interface IErrorResponse {
  errors: string[];
}
export interface IErrorsResponse {
  errors: { ['full_messages']: string[] };
}
export interface IServerMessages {
  severity: 'success' | 'error';
  alerts: string[];
}
