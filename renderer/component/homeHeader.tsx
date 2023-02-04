import React from "react";
import { theme, Menu, Tooltip } from "antd";
import { HomeOutlined, PoweroffOutlined } from "@ant-design/icons";
import commonCss from "styles/home.module.scss";
import { useRouter } from "next/router";
import { auth } from "../../services/firebase";
import { _roomId, _user, _roomTarget, _groupId } from "../recoil/globalState";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";

function HomeHeader() {
  const router = useRouter();
  const [roomId, setRoomId] = useRecoilState(_roomId);
  const setGroupId = useSetRecoilState(_groupId);
  const resetRoomId = useResetRecoilState(_roomId);
  const resetUser = useResetRecoilState(_user);
  const resetTarget = useResetRecoilState(_roomTarget);
  const resetGroupId = useResetRecoilState(_groupId);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { Item } = Menu;

  // 홈으로 이동
  const onGoHome = () => {
    setRoomId("");
    setGroupId("");
  };

  // 로그아웃
  const onLogout = () => {
    auth.signOut().then(() => {
      resetRoomId();
      resetGroupId();
      resetTarget();
      resetUser();

      router.replace("login");
    });
  };
  return (
    <>
      <Menu
        className={`${commonCss.home_header}`}
        mode="horizontal"
        selectable={false}
      >
        <Item key={1} translate="no">
          <Tooltip placement="bottom" title={"홈"}>
            <HomeOutlined style={{ fontSize: 20 }} onClick={onGoHome} />
          </Tooltip>
        </Item>
        <Item key={2}>
          <Tooltip placement="bottom" title={"로그아웃"}>
            <PoweroffOutlined style={{ fontSize: 20 }} onClick={onLogout} />
          </Tooltip>
        </Item>
      </Menu>
    </>
  );
}
export default HomeHeader;
