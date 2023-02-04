import React, { useEffect, useRef, useState } from "react";
import { Layout, theme, Menu } from "antd";
import {
  CommentOutlined,
  AliwangwangOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { onValue, query, ref } from "firebase/database";
import { db } from "../../services/firebase";
import { ItemType, SubMenuType } from "antd/es/menu/hooks/useItems";
import { useRecoilState, useSetRecoilState } from "recoil";
import { _groupId, _roomId, _roomTarget, _user } from "../recoil/globalState";

function HomeSider() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Sider } = Layout;
  const { SubMenu, Item } = Menu;
  const menuRef = useRef<any>(null);
  const [user, setUser] = useRecoilState(_user);

  const items2 = [CommentOutlined, AliwangwangOutlined].map((icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: index === 0 ? "그룹채팅" : "1:1 채팅",
    };
  });

  const [roomList, setRoomList] = useState<Array<ItemType>>(items2);
  const [roomChild, setRoomChild] = useState<Array<any>>([]);
  const [groupChild, setGroupChild] = useState<Array<any>>([]);
  const [roomId, setRoomId] = useRecoilState(_roomId);
  const [roomTarget, setRoomTarget] = useRecoilState(_roomTarget);
  const setGroupId = useSetRecoilState(_groupId);

  const selectRoom = (menu) => {
    if (menu.key) {
      setGroupId("");
      setRoomId(menu.key);
      setRoomTarget(menu.domEvent.target.innerText);
    }
  };

  const selectGroup = (menu) => {
    if (menu.key) {
      setRoomId("");
      setGroupId(menu.key);
      setRoomTarget(menu.domEvent.target.innerText);
    }
  };

  useEffect(() => {
    const sq1 = query(ref(db, "roomUsers/" + user.uid));

    onValue(sq1, async (list) => {
      const rList = list.val();

      if (rList) {
        const keys = Object.keys(rList);
        const tempArr = [];

        keys.map((key: string) => {
          tempArr.push({
            key: key,
            icon: <UserOutlined />,
            label: rList[key].target,
          });
        });

        setRoomChild(tempArr);
      } else {
        setRoomChild([]);
      }
    });

    const gq = query(ref(db, "groupUsers/" + user.uid));

    onValue(gq, async (list) => {
      const rList = list.val();

      if (rList) {
        const keys = Object.keys(rList);
        const tempArr = [];

        keys.map((key: string) => {
          tempArr.push({
            key: key,
            icon: <TeamOutlined />,
            label: rList[key].title,
          });
        });

        setGroupChild(tempArr);
      } else {
        setGroupChild([]);
      }
    });
  }, []);

  return (
    <>
      <Sider
        width={200}
        style={{
          background: colorBgContainer,
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={["sub1", "sub2"]}
          multiple={true}
          style={{
            height: "100%",
            borderRight: 0,
          }}
          ref={menuRef}
          selectedKeys={[roomId]}
        >
          {roomList &&
            roomList.map((room: SubMenuType, index) => {
              if (index === 0) {
                return (
                  <SubMenu key={room.key} icon={room.icon} title={room.label}>
                    {groupChild &&
                      groupChild.map((child: any) => {
                        return (
                          <Item
                            key={child.key}
                            onClick={selectGroup}
                            icon={child.icon}
                            title={child.label}
                          >
                            {child.label}
                          </Item>
                        );
                      })}
                  </SubMenu>
                );
              } else {
                return (
                  <SubMenu key={room.key} icon={room.icon} title={room.label}>
                    {roomChild &&
                      roomChild.map((child: any) => {
                        return (
                          <Item
                            key={child.key}
                            onClick={selectRoom}
                            icon={child.icon}
                            title={child.label}
                          >
                            {child.label}
                          </Item>
                        );
                      })}
                  </SubMenu>
                );
              }
            })}
        </Menu>
      </Sider>
    </>
  );
}
export default HomeSider;
