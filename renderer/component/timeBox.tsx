import moment from "moment";
import React from "react";
import { MessageModel } from "../../models/message";
import css from "styles/chatRoom.module.scss";

interface Props {
  date: string;
}

function TimeBox(props: Props) {
  const date = props.date;

  return (
    <div className={`${css.time_box_wrap}`}>
      <span className={`${css.time_box}`}>{date}</span>
    </div>
  );
}
export default TimeBox;
