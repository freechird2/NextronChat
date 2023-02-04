import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import Icon from "@ant-design/icons";
import commonCss from "styles/login.module.scss";
import Head from "next/head";
import Link from "next/link";
import { LoginData } from "../../models/loginData";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { useRouter } from "next/router";
import { get, query, ref } from "firebase/database";
import { useRecoilState } from "recoil";
import { _user } from "../recoil/globalState";

function Login() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useRecoilState(_user);
  const [loginData, setLoginData] = useState<LoginData>({
    id: "",
    password: "",
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;

    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // email 유효성 검사
  const validateEmail = useCallback((_, value) => {
    const regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (!value) {
      return Promise.reject(new Error("이메일을 입력해주세요."));
    }
    if (!value.match(regExp)) {
      return Promise.reject(new Error("올바른 이메일 형식이 아닙니다."));
    }
    return Promise.resolve();
  }, []);

  const onLogin = () => {
    if (!loginData.id || !loginData.password) {
      return;
    }

    messageApi.open({
      type: "loading",
      content: "로그인 중입니다..",
      duration: 0,
    });

    signInWithEmailAndPassword(auth, loginData.id, loginData.password)
      .then(() => {
        const q = query(ref(db, `users/${auth.currentUser.uid}`));

        get(q).then((result) => {
          if (result.val()) {
            setUser({
              uid: auth.currentUser.uid,
              email: result.val().email,
              nickname: result.val().nickname,
            });

            router.replace("/home");
          }
        });
      })
      .catch((error) => {
        messageApi.destroy();

        messageApi.open({
          type: "error",
          content: "이메일과 비밀번호를 확인해주세요.",
          duration: 2,
        });
      });
  };

  return (
    <React.Fragment>
      <Head>
        <title>로그인</title>
      </Head>
      {contextHolder}

      <div className={`${commonCss.login_layout}`}>
        <div className={`${commonCss.title}`}>Nextron Chat</div>
        <Form
          className={`${commonCss.login_form}`}
          form={form}
          scrollToFirstError
        >
          <Form.Item name="email" rules={[{ validator: validateEmail }]}>
            <Input
              prefix={<Icon style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="이메일"
              name="id"
              value={loginData.id}
              onChange={onChange}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "비밀번호를 입력해주세요.",
              },
            ]}
          >
            <Input
              prefix={<Icon style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={onChange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={`${commonCss.login_form_button}`}
              onClick={onLogin}
            >
              Login
            </Button>
            <div className={`${commonCss.join_title}`}>
              <Link href="/join">
                <a>처음이신가요?</a>
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </React.Fragment>
  );
}

export default Login;
