export interface CreatePrivateRoomData {
  user: string;
  userNickname: string;
  targetUid: string;
  target: string;
  regist_date: string;
}

export interface CreateGroupChatData {
  title: string;
  nickname: string;
  uid: string;
  regist_date: string;
}
