import React from "react";
import CreateGroup from "./createGroup";
import css from "styles/homeContent.module.scss";
import InviteUser from "./inviteUser";
import JoinGroup from "./joinGroup";

function HomeContent() {
  return (
    <>
      <div className={`${css.content_title}`}>
        <span>Nextron과 firebase를 이용해 만든 채팅 앱입니다.</span>
      </div>
      <div className={`${css.content_start}`}>
        <CreateGroup />
        <JoinGroup />
        <InviteUser />
      </div>
    </>
  );
}
export default HomeContent;
