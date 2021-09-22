import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
// import axios from "axios";
import webSocket from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import defaultUser from "../../assets/images/defaultUser.png";

import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

import moment from "moment";

const ContainerDivStyled = styled.div`
  background-color: #282c34;
  height: 100vh;
  color: #fff;
  overflow: hidden;
  padding-bottom: 40px;
`;

const ContentDivStyled = styled.div`
  height: 100%;
  overflow: auto;
  ul {
    display: flex;
    padding: 10px;
  }
  .msgBox {
    .profile {
      margin: 2px;
      width: 50px;
      height: 50px;
      background-color: #fff;
      border-radius: 50%;
      overflow: hidden;
      .img {
        width: 100%;
        height: 100%;
        display: inline-block;
        object-fit: contain;
      }
    }
    .body {
      position: relative;
      padding-left: 5px;
      .name {
        font-size: 12px;
      }
      .msg {
        background-color: #7d7d7d;
        border-radius: 10px;
        padding: 5px;
        font-size: 14px;
        margin-left: 8px;
        position: relative;
        &:after {
          content: "";
          display: inline-block;
          position: absolute;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 6.5px 12px 6.5px 0;
          border-color: transparent #7d7d7d transparent transparent;
          left: -10px;
          top: 12px;
        }
      }
    }
    .date {
      font-size: 12px;
      display: flex;
      align-items: flex-end;
      padding-left: 5px;
      color: #bdbdbd;
    }
    &-user {
      ul {
        flex-direction: row-reverse;
      }
      .body {
        padding-right: 5px;
        .name {
          text-align: right;
        }
        .msg {
          margin-right: 8px;
          background-color: #27a55c;
          &:after {
            border-width: 6.5px 0 6.5px 12px;
            border-color: transparent transparent transparent #27a55c;
            left: auto;
            right: -10px;
            top: 12px;
          }
        }
      }
    }
    &-announcement {
      text-align: center;
      padding: 5px;
      > div {
        padding: 10px;
        background-color: #a0a0a059;
        display: inline-block;
        border-radius: 50px;
        font-size: 14px;
      }
    }
  }
`;

const ToolBarDivStyled = styled.div`
  color: #000;
  height: 40px;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  input {
    width: 80%;
  }
  .buttonDiv {
    width: 10%;
    display: inline-block;
    padding: 0 5px;
  }
  button {
    width: 100%;
  }
  * {
    height: 100%;
  }
`;

// TS
const Chat = () => {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState(null);
  const [inputMsg, setInputMsg] = useState("");

  useEffect(() => {
    if (ws) {
      //連線成功在 console 中打印訊息
      console.log("success connect!");
      //設定監聽
      initWebSocket();
    }
  }, [ws]);

  const initWebSocket = () => {
    const uuid = uuidv4();

    // setMessages(
    //   (preVal) =>
    //     (preVal = [
    //       {
    //         message: "妳好",
    //         crated: uuid,
    //         name: "Rex",
    //       },
    //       {
    //         message: "很好",
    //         crated: "043853904859034534",
    //         name: "John",
    //       },
    //     ])
    // );

    console.log(messages);

    setId((preVal) => (preVal = uuid));
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    ws.emit("joinChatRoom", {
      id: uuid,
      name: location.state.name,
    });

    // 訊息事件
    ws.on("getAllMessage", (data) => {
      console.log("訊息事件:", data);

      const { id, name, message, date } = data;

      setMessages((preVal) => [
        ...preVal,
        {
          message,
          crated: id,
          name,
          date,
        },
      ]);
    });

    // 公告事件
    ws.on("announcement", (data) => {
      console.log("公告事件:", data);

      const { message, crated, name } = data;
      setMessages((preVal) => [
        ...preVal,
        {
          message,
          crated,
          name,
          date: null,
        },
      ]);
    });
  };

  // const sendMessage = () => {
  //   //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
  //   // ws.emit('getMessage', '只回傳給發送訊息的 client');
  // };

  //  ---- init

  useEffect(() => {
    if (!location.state || !location.state.name) {
      history.push("/");
    }
    setLoading((preVal) => (preVal = true));

    const newSocket = webSocket(
      process.env.REACT_APP_API_DOMAIN
        ? process.env.REACT_APP_API_DOMAIN
        : "https://localhost:3000/",
      {
        transports: ["websocket"],
      }
    );

    setTimeout(() => {
      setWs(newSocket);
      setLoading((preVal) => (preVal = false));
    }, 2000);

    return () => {
      ws.emit("exitChatRoom", {
        id,
        name: location.state.name,
      });

      newSocket.close();
    };
  }, []);

  return (
    <ContainerDivStyled>
      <div className="text-center p-4">
        <h2>
          {loading
            ? "Loading..."
            : `Welcome ${
                location.state && location.state.name
                  ? location.state.name
                  : "unknow"
              } 😄`}
          {id}
        </h2>
      </div>
      <ContentDivStyled>
        {messages.map((message, idx) => {
          if (message.name === "announcement") {
            return (
              <div className="msgBox-announcement">
                <div>{message.message}</div>
              </div>
            );
          } else {
            return (
              <div
                className={`${
                  message.crated === id ? "msgBox-user" : "msgBox-others"
                } msgBox`}
                key={idx}
              >
                <ul>
                  <li className="profile">
                    <img className="img" src={defaultUser} alt="User Profile" />
                  </li>
                  <li className="body">
                    <div className="name">{message.name}</div>
                    <div className="msg">{message.message}</div>
                  </li>
                  <li className="date">{message.date}</li>
                </ul>
              </div>
            );
          }
        })}
      </ContentDivStyled>
      <ToolBarDivStyled>
        <input
          className="w-100"
          type="text"
          placeholder="Write Something..."
          onChange={(e) => {
            setInputMsg((preVal) => (preVal = e.target.value));
          }}
          value={inputMsg}
        />
        <div className="buttonDiv">
          <Button
            loading={loading}
            variant="contained"
            onClick={() => {
              if (!inputMsg || loading) return;

              ws.emit("sendMessage", {
                id: id,
                name: location.state.name,
                message: inputMsg,
                date: moment().format("YYYY-MM-DD HH:mm:ss"),
              });

              setInputMsg((preVal) => (preVal = ""));
            }}
          >
            Submit
          </Button>
        </div>
        <div className="buttonDiv">
          <Button variant="contained">
            <Link
              to={{
                pathname: "/",
              }}
            >
              Exit
            </Link>
          </Button>
        </div>
      </ToolBarDivStyled>
    </ContainerDivStyled>
  );
};

export default Chat;
