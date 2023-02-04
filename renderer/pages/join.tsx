import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Button, Form, Input, message } from "antd";
import commonCss from "styles/join.module.scss";
import { useRouter } from "next/router";
import { RegistData, ValidRegistData } from "../../models/registData";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import {
  ref,
  set,
  get,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "../../services/firebase";
import moment from "moment";
import { useRecoilState } from "recoil";
import { _user } from "../recoil/globalState";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

function Join() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [registData, setRegistData] = useState<RegistData>({
    email: "",
    password: "",
    confirm: "",
    nickname: "",
  });
  const [validData, setValidData] = useState<ValidRegistData>({
    email: false,
    password: false,
    confirm: false,
    nickname: false,
  });

  const [valueCheck, setValueCheck] = useState<boolean>(false);
  const [user, setUser] = useRecoilState(_user);
  let loading = false;

  const onFinish = () => {
    if (!valueCheck) return;
    if (loading) return;

    loading = true;
    registUser();
  };

  const moveLogin = () => {
    router.push("/login");
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setRegistData((prev) => ({ ...prev, [name]: value }));
  };

  // email 유효성 검사
  const validateEmail = useCallback((_, value) => {
    const regExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (!value) {
      setValidData((prev) => ({ ...prev, email: false }));
      return Promise.reject(new Error("이메일은 필수 항목입니다."));
    }
    if (!value.match(regExp)) {
      setValidData((prev) => ({ ...prev, email: false }));
      return Promise.reject(new Error("올바른 이메일 형식이 아닙니다."));
    }
    setValidData((prev) => ({ ...prev, email: true }));
    return Promise.resolve();
  }, []);

  // password 유효성 검사
  const validatePassword = useCallback((_, value: string) => {
    if (!value) {
      setValidData((prev) => ({ ...prev, password: false }));
      return Promise.reject(new Error("비밀번호는 필수 항목입니다."));
    }
    if (value.length < 6 || value.length > 12) {
      setValidData((prev) => ({ ...prev, password: false }));
      return Promise.reject(new Error("비밀번호는 6~12자로 입력해주세요."));
    }
    setValidData((prev) => ({ ...prev, password: true }));
    return Promise.resolve();
  }, []);

  // passwordCheck 유효성 검사
  const validatePasswordCheck = useCallback((_, value: string) => {
    if (
      form.getFieldValue("password") &&
      form.getFieldValue("password") !== value
    ) {
      setValidData((prev) => ({ ...prev, confirm: false }));
      return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
    }
    if (value.length < 6 || value.length > 12) {
      setValidData((prev) => ({ ...prev, confirm: false }));
      return Promise.reject(new Error("비밀번호는 6~12자로 입력해주세요."));
    }
    setValidData((prev) => ({ ...prev, confirm: true }));
    return Promise.resolve();
  }, []);

  // nickname 유효성 검사
  const validateNickname = useCallback((_, value: string) => {
    if (!value) {
      setValidData((prev) => ({ ...prev, nickname: false }));
      return Promise.reject(new Error("닉네임을 입력해주세요."));
    }
    setValidData((prev) => ({ ...prev, nickname: true }));
    return Promise.resolve();
  }, []);

  // email 중복 검사
  const onBlurEmail = useCallback(() => {
    if (
      form.getFieldError("email").length === 0 &&
      form.getFieldValue("email")
    ) {
      const q = query(
        ref(db, "users"),
        orderByChild("email"),
        equalTo(form.getFieldValue("email"))
      );

      onValue(
        q,
        (snapshot) => {
          const data = snapshot.val();

          if (data) {
            setValidData((prev) => ({ ...prev, email: false }));
            form.setFields([
              {
                name: "email",
                errors: ["사용중인 이메일 입니다."],
              },
            ]);
          } else {
            setValidData((prev) => ({ ...prev, email: true }));
          }
        },
        {
          onlyOnce: true,
        }
      );
    } else {
      setValidData((prev) => ({ ...prev, email: false }));
    }
  }, []);

  // 회원 가입
  const registUser = () => {
    messageApi.open({
      type: "loading",
      content: "잠시만 기다려주세요..",
      duration: 0,
    });

    createUserWithEmailAndPassword(auth, registData.email, registData.password)
      .then(() => {
        signInWithEmailAndPassword(
          auth,
          registData.email,
          registData.password
        ).then(() => {
          const result = insertUser(auth.currentUser.uid, registData);

          if (result) {
            setUser({
              uid: auth.currentUser.uid,
              email: registData.email,
              nickname: registData.nickname,
            });

            messageApi.destroy();
            router.replace("/home");
          } else {
            messageApi.open({
              type: "error",
              content: "회원가입 중 오류가 발생했습니다.",
            });
          }
        });
      })
      .catch((error) => {
        loading = false;
        messageApi.open({
          type: "error",
          content: "회원가입 중 오류가 발생했습니다.",
        });
      });
  };

  // 유저정보 db insert
  const insertUser = (uid: string, registData: RegistData) => {
    const { email, nickname } = registData;

    if (!uid || !email || !nickname) {
      return false;
    }

    set(ref(db, "users/" + uid), {
      email: email,
      nickname: nickname,
      regist_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      loginYn: "Y",
    });

    return true;
  };

  useEffect(() => {
    const { email, password, confirm, nickname } = validData;

    if (email && password && confirm && nickname) {
      setValueCheck(true);
    } else {
      setValueCheck(false);
    }
  }, [validData]);

  return (
    <React.Fragment>
      <Head>
        <title>회원가입</title>
      </Head>
      {contextHolder}
      <div className={`${commonCss.join_layout}`}>
        <div className={`${commonCss.title} ${commonCss.center}`}>회원가입</div>
        <Form
          {...formItemLayout}
          className={`${commonCss.join_form}`}
          form={form}
          name="register"
          style={{ maxWidth: 600, paddingRight: 100 }}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="이메일"
            rules={[{ validator: validateEmail }]}
          >
            <Input
              name="email"
              value={registData.email}
              onChange={onChange}
              onBlur={onBlurEmail}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="비밀번호"
            rules={[{ validator: validatePassword }]}
            hasFeedback
          >
            <Input.Password
              name="password"
              value={registData.password}
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="비밀번호 확인"
            dependencies={["password"]}
            hasFeedback
            rules={[{ validator: validatePasswordCheck }]}
          >
            <Input.Password
              name="confirm"
              value={registData.confirm}
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="닉네임"
            rules={[{ validator: validateNickname }]}
          >
            <Input
              name="nickname"
              value={registData.nickname}
              onChange={onChange}
            />
          </Form.Item>
        </Form>

        <div className={`${commonCss.center} ${commonCss.footer}`}>
          <Button className={`${commonCss.backBtn}`} onClick={moveLogin}>
            뒤로가기
          </Button>
          <Button type="primary" disabled={!valueCheck} onClick={onFinish}>
            가입하기
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Join;
