import React from "react";
import { MessageModel } from "../../models/message";
import css from "styles/chatRoom.module.scss";
import { useRecoilState } from "recoil";
import { _user } from "../recoil/globalState";
import moment from "moment";
import { Avatar } from "antd";
import { UserOutlined, StarOutlined } from "@ant-design/icons";
interface props extends MessageModel {
  group?: boolean;
  orner?: boolean;
}

function MessageBox(props: props) {
  const msg: MessageModel = props;
  const [user, setUser] = useRecoilState(_user);

  const loginUser: boolean = user.uid === msg.uid;

  return (
    <div className={`${css.m_box_wrap} ${loginUser ? css.left_box : ""}`}>
      {loginUser && (
        <span className={`${css.msg_box_time}`}>
          {moment(msg.regist_date).format("HH:mm")}
        </span>
      )}
      {props.group ? (
        <div className={`${loginUser ? css.ta_r : css.ta_l}`}>
          <div style={{ fontSize: 16, padding: "0 13px" }}>
            <Avatar
              className={`${props.orner ? css.orner_color : ""}`}
              size={20}
              icon={props.orner ? <StarOutlined /> : <UserOutlined />}
              style={{ marginRight: 5, fontSize: 16 }}
            />
            {msg.name}
          </div>
          <div
            className={`${css.m_box} ${loginUser ? css.login_user_box : ""}`}
          >
            <span>{msg.msg}</span>
          </div>
        </div>
      ) : (
        <div className={`${css.m_box} ${loginUser ? css.login_user_box : ""}`}>
          <span>{msg.msg}</span>
        </div>
      )}

      {user.uid !== msg.uid && (
        <span className={`${css.msg_box_time}`}>
          {moment(msg.regist_date).format("HH:mm")}
        </span>
      )}
    </div>
  );
}
export default MessageBox;
