import moment from "moment";
import React from "react";
import { MessageModel } from "../../models/message";
import css from "styles/chatRoom.module.scss";

interface Props {
  msg: string;
}

function SystemBox(props: Props) {
  const msg = props.msg;

  return (
    <div className={`${css.time_box_wrap}`} style={{ height: 60 }}>
      <span className={`${css.time_box}`}>{msg}</span>
    </div>
  );
}
export default SystemBox;
