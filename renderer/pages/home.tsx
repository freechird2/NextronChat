import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Layout, theme } from "antd";
import commonCss from "styles/home.module.scss";
import HomeSider from "../component/homeSider";
import HomeHeader from "../component/homeHeader";
import HomeContent from "../component/homeContent";
import ChatRoom from "../component/chatRoom";
import { _groupId, _roomDate, _roomId, _user } from "../recoil/globalState";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { useRouter } from "next/router";
import GroupChat from "../component/groupChat";

const { Header, Content } = Layout;

function Home() {
  const {
    token: { colorBgContainer, fontFamily },
  } = theme.useToken();
  const router = useRouter();
  const user = useRecoilValue(_user);
  const [roomId, setRoomId] = useRecoilState(_roomId);
  const groupId = useRecoilValue(_groupId);
  const resetDate = useResetRecoilState(_roomDate);

  useEffect(() => {
    if (!user.uid) {
      router.replace("/login");
    }
  }, []);

  useEffect(() => {
    resetDate();
  }, [roomId]);

  return (
    <React.Fragment>
      <Head>
        <title>Nextron Chatting App</title>
      </Head>
      <Layout className={`${commonCss.home_section}`}>
        <HomeSider></HomeSider>
        <Layout>
          <Header
            className="header"
            style={{
              padding: "0 24px",
              margin: 0,
              background: colorBgContainer,
              fontFamily: fontFamily,
            }}
          >
            <HomeHeader />
          </Header>
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              position: "relative",
              overflowX: "hidden",
            }}
          >
            {!roomId && !groupId ? (
              <HomeContent />
            ) : roomId ? (
              <ChatRoom />
            ) : (
              <GroupChat />
            )}
          </Content>
        </Layout>
      </Layout>
    </React.Fragment>
  );
}

export default Home;
