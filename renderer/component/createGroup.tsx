import React, { ChangeEvent, useState } from "react";
import css from "styles/homeContent.module.scss";
import { Button, Modal, Input, message } from "antd";
import {
  UsergroupAddOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { equalTo, get, orderByChild, query, ref } from "firebase/database";
import { db } from "../../services/firebase";
import { createGroupChat } from "../function/common";
import { CreateGroupChatData } from "../../models/createRoomData";
import moment from "moment";
import { _groupId, _roomId, _roomTarget, _user } from "../recoil/globalState";
import { useRecoilState, useSetRecoilState } from "recoil";

function CreateGroup() {
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(false);
  const [chatName, setChatName] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [roomTarget, setRoomTarget] = useRecoilState(_roomTarget);
  const [user, setUser] = useRecoilState(_user);
  const setRoomId = useSetRecoilState(_roomId);
  const [groupId, setGroupId] = useRecoilState(_groupId);

  const showModal = () => {
    setValid(false);
    setChatName("");
    setOpen(true);
  };

  const handleCancel = () => {
    setValid(false);
    setChatName("");
    setOpen(false);
  };

  const onCreate = () => {
    if (!valid) return;

    if (chatName) {
      const q = query(
        ref(db, "groupChat"),
        orderByChild("title"),
        equalTo(chatName)
      );

      get(q).then((result) => {
        if (result) {
          const data = result.val();

          if (data) {
            messageApi.open({
              type: "error",
              content: "이미 존재하는 그룹채팅방 이름입니다.",
            });
          } else {
            const cData: CreateGroupChatData = {
              title: chatName,
              nickname: user.nickname,
              uid: user.uid,
              regist_date: moment().format("YYYY-MM-DD HH:mm:ss"),
            };

            createGroupChat(cData).then((rId) => {
              setRoomId("");
              setRoomTarget(chatName);
              setGroupId(rId);
            });
          }
        }
      });
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setChatName(value);

    if (!value || value.length < 2 || value.length > 50) {
      setValid(false);
    } else {
      setValid(true);
    }
  };

  const onKeyPress = (e: any) => {
    if (e.key == "Enter") {
      onCreate();
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className={`${css.content_middle} ${css.custom_btn} ${css.btn_1}`}
        onClick={showModal}
      >
        그룹채팅
        <br />
        생성하기
        <div className={`${css.content_button_wrap}`}>
          <UsergroupAddOutlined />
        </div>
      </div>
      <Modal
        open={open}
        centered
        title="그룹채팅을 생성해보세요!"
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type={valid ? "primary" : "default"}
            onClick={onCreate}
          >
            그룹채팅 생성하기
          </Button>,
        ]}
        width={400}
      >
        <Input
          status={valid ? "" : "error"}
          placeholder="채팅방 이름을 입력해주세요 (2~50자 이내)"
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
          value={chatName}
          onKeyPress={onKeyPress}
          style={{ marginTop: 8 }}
        />
      </Modal>
    </>
  );
}
export default CreateGroup;
