import { atom } from "recoil";
import { v1 } from "uuid";
import { LoginUserModel } from "../../models/loginUser";

export const _roomId = atom({
  key: `roomId/${v1()}`,
  default: "",
});

export const _roomTarget = atom({
  key: `roomTarget/${v1()}`,
  default: "",
});

const defaultUserModel: LoginUserModel = {
  uid: "",
  email: "",
  nickname: "",
};

export const _user = atom({
  key: `user/${v1()}`,
  default: defaultUserModel,
});

export const _roomDate = atom({
  key: `roomDate/${v1()}`,
  default: "",
});

export const _groupId = atom({
  key: `groupId/${v1()}`,
  default: "",
});
