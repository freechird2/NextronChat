import React, { ChangeEvent, useEffect, useState } from "react";
import css from "styles/homeContent.module.scss";
import { Button, Modal, Input, message } from "antd";
import {
  UserAddOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  child,
  equalTo,
  get,
  onValue,
  orderByChild,
  query,
  ref,
} from "firebase/database";
import { db } from "../../services/firebase";
import { createChatRoom } from "../function/common";
import { CreatePrivateRoomData } from "../../models/createRoomData";
import moment from "moment";
import { LoginUserModel } from "../../models/loginUser";
import { _groupId, _roomId, _roomTarget, _user } from "../recoil/globalState";
import { useRecoilState, useSetRecoilState } from "recoil";

function InviteUser() {
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [roomId, setRoomId] = useRecoilState(_roomId);
  const [roomTarget, setRoomTarget] = useRecoilState(_roomTarget);
  const [user, setUser] = useRecoilState(_user);
  const setGroupId = useSetRecoilState(_groupId);

  const showModal = () => {
    setValid(false);
    setEmail("");
    setOpen(true);
  };

  const handleCancel = () => {
    setValid(false);
    setEmail("");
    setOpen(false);
  };

  const onInvite = () => {
    if (!valid) return;

    if (email) {
      const q = query(ref(db, "users"), orderByChild("email"), equalTo(email));

      onValue(
        q,
        async (snapshot) => {
          const data = snapshot.val();

          if (!data) {
            messageApi.open({
              type: "error",
              content: "존재하지 않는 회원입니다.",
            });
          } else {
            const currentUser: string = user.uid;
            const targetUser: string = Object.keys(data).toString();

            if (currentUser === targetUser) {
              messageApi.open({
                type: "error",
                content: "본인과 채팅할 순 없습니다.",
              });

              return;
            }

            const userArray = [currentUser, targetUser];
            userArray.sort();

            const sq1 = query(
              ref(db, "room"),
              orderByChild("user"),
              equalTo(`${userArray[0]}_${userArray[1]}`)
            );

            onValue(
              sq1,
              async (list) => {
                const uList = list.val();
                setRoomTarget(data[Object.keys(data).toString()].nickname);

                if (uList) {
                  setRoomId(Object.keys(uList).toString());
                } else {
                  const roomData: CreatePrivateRoomData = {
                    user: `${userArray[0]}_${userArray[1]}`,
                    userNickname: user.nickname,
                    targetUid: Object.keys(data).toString(),
                    target: data[Object.keys(data).toString()].nickname,
                    regist_date: moment().format("YYYY-MM-DD HH:mm:ss"),
                  };

                  createChatRoom(roomData, user).then((rId) => {
                    setGroupId("");
                    setRoomId(rId);
                  });
                }
              },
              { onlyOnce: true }
            );
          }
        },
        { onlyOnce: true }
      );
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setEmail(value);

    if (!value) {
      setValid(false);
    } else {
      const regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

      if (!value.match(regExp)) {
        setValid(false);
      } else {
        setValid(true);
      }
    }
  };

  const onKeyPress = (e: any) => {
    if (e.key == "Enter") {
      onInvite();
    }
  };
  return (
    <>
      {contextHolder}
      <div
        className={`${css.content_middle} ${css.custom_btn} ${css.btn_1}`}
        onClick={showModal}
      >
        1:1 채팅
        <br />
        시작하기
        <div className={`${css.content_button_wrap}`}>
          <UserAddOutlined />
        </div>
      </div>
      <Modal
        open={open}
        centered
        title="친구에게 메세지를 보내보세요!"
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type={valid ? "primary" : "default"}
            onClick={onInvite}
          >
            채팅 시작하기
          </Button>,
        ]}
        width={400}
      >
        <Input
          status={valid ? "" : "error"}
          placeholder="친구의 이메일을 입력해주세요"
          prefix={
            valid ? (
              <CheckCircleOutlined
                style={{
                  color: "#52c41a",
                  fontSize: 20,
                  marginTop: 4,
                  marginBottom: 4,
                  marginRight: 4,
                }}
              />
            ) : (
              <ExclamationCircleOutlined
                style={{
                  fontSize: 20,
                  marginTop: 4,
                  marginBottom: 4,
                  marginRight: 4,
                }}
              />
            )
          }
          onChange={onChange}
          value={email}
          onKeyPress={onKeyPress}
          style={{ marginTop: 8 }}
        />
      </Modal>
    </>
  );
}
export default InviteUser;
