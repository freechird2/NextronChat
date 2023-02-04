import {
  get,
  limitToFirst,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import {
  CreateGroupChatData,
  CreatePrivateRoomData,
} from "../../models/createRoomData";
import { db } from "../../services/firebase";
import { LoginUserModel } from "../../models/loginUser";
import moment from "moment";

export const createChatRoom = async (
  data: CreatePrivateRoomData,
  user: LoginUserModel
) => {
  const rId = new Date().getTime().toString(36);

  set(ref(db, "room/" + rId), {
    user: data.user,
    regist_date: data.regist_date,
  });

  set(ref(db, `roomUsers/${user.uid}/${rId}`), {
    target: data.target,
  });

  set(ref(db, `roomUsers/${data.targetUid}/${rId}`), {
    target: user.nickname,
  });

  return rId;
};

export const createGroupChat = async (data: CreateGroupChatData) => {
  const rId = new Date().getTime().toString(36);

  set(ref(db, `groupChat/${rId}`), {
    title: data.title,
    uId: data.uid,
    regist_date: data.regist_date,
  });

  set(ref(db, `groupUsers/${data.uid}/${rId}`), {
    title: data.title,
  });

  const mId = new Date().getTime().toString(36);
  set(ref(db, `message/${rId}/${mId}`), {
    msg: `${data.nickname}님이 참가하셨습니다.`,
    name: "",
    uid: "",
    regist_date: moment().format("YYYY-MM-DD HH:mm:ss"),
  });

  set(ref(db, `groupUserList/${rId}/${data.uid}`), {
    nickname: data.nickname,
  });

  return rId;
};

export const joinGroupChat = async (data: CreateGroupChatData, rId) => {
  set(ref(db, `groupUsers/${data.uid}/${rId}`), {
    title: data.title,
  });

  const mId = new Date().getTime().toString(36);
  set(ref(db, `message/${rId}/${mId}`), {
    msg: `${data.nickname}님이 참가하셨습니다.`,
    name: "",
    uid: "",
    regist_date: moment().format("YYYY-MM-DD HH:mm:ss"),
  });

  set(ref(db, `groupUserList/${rId}/${data.uid}`), {
    nickname: data.nickname,
  });

  return rId;
};

export const sendMessage = (user: LoginUserModel, rId: string, msg: string) => {
  if (msg) {
    const mId = new Date().getTime().toString(36);

    set(ref(db, `message/${rId}/${mId}`), {
      msg,
      name: user.nickname,
      uid: user.uid,
      regist_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
  }
};

export const exitGroupChat = async (
  uid: string,
  nickname: string,
  gid: string
) => {
  try {
    remove(ref(db, `groupUserList/${gid}/${uid}`)).then(() => {
      get(query(ref(db, `groupUserList/${gid}`))).then((gData) => {
        const group = gData.val();

        if (!group) {
          remove(ref(db, `groupChat/${gid}`));
          remove(ref(db, `message/${gid}`));
        } else {
          get(query(ref(db, `groupChat/${gid}/uId`))).then((data) => {
            if (data.val() === uid) {
              get(query(ref(db, `groupUserList/${gid}`), limitToFirst(1))).then(
                (user) => {
                  if (user.val()) {
                    const newUid = Object.keys(user.val()).toString();
                    update(ref(db, `groupChat/${gid}`), { uId: newUid });
                  }
                }
              );
            }
          });
        }
      });
    });
    remove(ref(db, `groupUsers/${uid}/${gid}`));

    const mId = new Date().getTime().toString(36);
    set(ref(db, `message/${gid}/${mId}`), {
      msg: `${nickname}님이 퇴장하셨습니다.`,
      name: "",
      uid: "",
      regist_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
  } catch {
    return false;
  }
};

export const exitRoom = async (
  uid: string,
  targetId: string,
  roomId: string
) => {
  remove(ref(db, `room/${roomId}`));
  remove(ref(db, `message/${roomId}`));
  remove(ref(db, `roomUsers/${uid}/${roomId}`));
  remove(ref(db, `roomUsers/${targetId}/${roomId}`));
};
