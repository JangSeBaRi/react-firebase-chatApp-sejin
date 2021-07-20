import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db, firebaseApp, firebase } from "../firebase";
import mime from "mime-types";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import { AiOutlineLock } from "react-icons/ai";
import { setPhotoURL } from "../reducers/user";
import { setCurrentChatRoom } from "../reducers/chat";
import { useHistory } from "react-router-dom";

const ChatList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.user.userProfile);

    const inputOpenImageRef = useRef();
    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    };
    const handleLogout = () => {
        firebaseApp.auth().signOut();
    };

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];

        if (!file) return;
        const metadata = { contentType: mime.lookup(file.name) };

        try {
            // //스토리지에 파일 저장
            let uploadTaskSnapshot = await firebase
                .storage()
                .ref()
                .child(`user_image/${user.uid}`)
                .put(file, metadata);

            let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

            // 프로필 수정
            await firebaseApp.auth().currentUser.updateProfile({
                photoURL: downloadURL,
            });
            // 바뀐 이미지로 보여주기
            dispatch(setPhotoURL(downloadURL));

            // 데이터베이스 수정
            db.collection("users").doc(user.uid).update({
                photoURL: downloadURL,
            });
            // db.collection("chatRoom")
            //     .orderBy("created")
            //     .onSnapshot((snapshot) => {
            //         snapshot.docs.forEach((doc) => {
            //             db.collection("chatRoom")
            //                 .doc(doc.id)
            //                 .collection("message")
            //                 .orderBy("created")
            //                 .onSnapshot((shot) => {
            //                     shot.docs.forEach((document) => {
            //                         if (
            //                             document.data().createdBy.uid ==
            //                             user.uid
            //                         ) {
            //                             db.collection("chatRoom")
            //                                 .doc(doc.id)
            //                                 .collection("message")
            //                                 .doc(document.id)
            //                                 .update({
            //                                     createdBy: {
            //                                         ...document.data()
            //                                             .createdBy,
            //                                         image: downloadURL,
            //                                     },
            //                                 });
            //                         }
            //                     });
            //                 });
            //         });
            //     });
        } catch (error) {
            alert(error);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [chatRoomName, setChatRoomName] = useState("");
    const [chatRoomPw, setChatRoomPw] = useState("");
    const [chatRoomArray, setChatRoomArray] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState({});

    useEffect(() => {
        const chatRoomRef = db.collection("chatRoom");
        chatRoomRef.orderBy("created").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = snapshot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    });
                    setChatRoomArray(data);
                } else if (change.type === "modified") {
                    const data = snapshot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    });
                    setChatRoomArray(data);
                } else if (change.type === "removed") {
                    const data = snapshot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    });
                    setChatRoomArray(data);
                }
            });
        });
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const submitAddRoom = (e) => {
        e.preventDefault();
        if (!chatRoomName.replace(/\s/gi, "")) {
            alert("채팅방 이름을 입력해주세요.");
        } else {
            (async () => {
                try {
                    await db.collection("chatRoom").add({
                        roomName: chatRoomName,
                        roomPassword: chatRoomPw,
                        createdBy: {
                            name: user.displayName,
                            image: user.photoURL,
                            uid: user.uid,
                        },
                        created: firebase.firestore.Timestamp.now().seconds,
                    });
                    // 방 생성 시 생성 된 방으로 이동 >>> 버그 생김.
                    // const chatRoomRef = db.collection("chatRoom");
                    // chatRoomRef.orderBy("created").onSnapshot((snapshot) => {
                    //     let data = [];
                    //     snapshot.docChanges().forEach((change) => {
                    //         if (change.type === "added") {
                    //             data = snapshot.docs.map((doc) => {
                    //                 return {
                    //                     id: doc.id,
                    //                     ...doc.data(),
                    //                 };
                    //             });
                    //         }
                    //     });
                    //     history.push(`chat/room/${data[data.length-1].id}`);
                    // });
                    setChatRoomName("");
                    setChatRoomPw("");
                    closeModal();
                } catch (error) {
                    alert(error);
                }
            })();
        }
    };

    const [showPwModal, setShowPwModal] = useState(false);
    const [pwModal, setPwModal] = useState("");

    const openPwModal = () => {
        setShowPwModal(true);
    };

    const closePwModal = () => {
        setShowPwModal(false);
    };

    const submitRoomPw = (e) => {
        e.preventDefault();
        if (pwModal != selectedRoom.roomPassword) {
            alert("비밀번호가 틀렸습니다.");
        } else {
            history.push(`chat/room/${selectedRoom.id}`);
            setPwModal("");
            closePwModal();
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: "50px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "80px",
                    border: ".2rem solid #ececec",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                    padding: "10px",
                    position: "relative",
                }}
            >
                {/* 채널홈, 즐겨찾기, 친구, 사용자 */}
                <button
                    style={{
                        backgroundColor: "white",
                        border: ".2rem solid #ececec",
                        padding: "0.5rem",
                        height: "100%",
                        width: "150px",
                        borderRadius: 5,
                        fontSize: 20,
                    }}
                    onClick={() => alert("채널홈")}
                >
                    채널홈
                </button>
                <button
                    style={{
                        backgroundColor: "white",
                        border: ".2rem solid #ececec",
                        padding: "0.5rem",
                        height: "100%",
                        width: "150px",
                        borderRadius: 5,
                        fontSize: 20,
                        marginLeft: 5,
                    }}
                    onClick={() => alert("준비중 입니다.")}
                >
                    즐겨찾기
                </button>
                <button
                    style={{
                        backgroundColor: "white",
                        border: ".2rem solid #ececec",
                        padding: "0.5rem",
                        height: "100%",
                        width: "150px",
                        borderRadius: 5,
                        fontSize: 20,
                        marginLeft: 5,
                    }}
                    onClick={() => alert("준비중 입니다.")}
                >
                    친구(DM)
                </button>
                <div
                    style={{
                        display: "flex",
                        position: "absolute",
                        top: 15,
                        right: 10,
                    }}
                >
                    <Image
                        style={{
                            width: "30px",
                            height: "30px",
                            marginTop: "3px",
                        }}
                        src={user && user.photoURL}
                        roundedCircle
                    />
                    <Dropdown>
                        <Dropdown.Toggle
                            style={{
                                background: "transparent",
                                border: "0px",
                                color: "black",
                            }}
                            id="dropdown-basic"
                        >
                            {user && user.displayName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleOpenImageRef}>
                                프로필 사진 변경
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}>
                                로그아웃
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    ref={inputOpenImageRef}
                    style={{ display: "none" }}
                    onChange={handleUploadImage}
                />
            </div>
            <div
                style={{
                    width: "100%",
                    height: "500px",
                    border: ".2rem solid #ececec",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                    overflowY: "auto",
                }}
                className="hide-scroll"
            >
                {/* 검색기능, 헤더, 채팅리스트 */}
                <div
                    style={{
                        display: "flex",
                        border: "1px solid #ececec",
                        padding: 5,
                        backgroundColor: "#f3f3f3",
                        fontSize: 20,
                        fontWeight: "bold",
                    }}
                >
                    <div
                        style={{
                            width: "100px",
                            textAlign: "center",
                            borderRight: "2px solid #ececec",
                        }}
                    >
                        잠금
                    </div>
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            borderRight: "2px solid #ececec",
                        }}
                    >
                        제목
                    </div>
                    <div
                        style={{
                            width: "150px",
                            textAlign: "center",
                            borderRight: "2px solid #ececec",
                        }}
                    >
                        인원
                    </div>
                    <div style={{ width: "200px", textAlign: "center" }}>
                        방장
                    </div>
                </div>
                {chatRoomArray.map((v, i) => {
                    return (
                        <div
                            style={{
                                display: "flex",
                                border: "1px solid #ececec",
                                padding: 5,
                                backgroundColor:
                                    selectedRoom == v ? "#7a83ebc2" : "white",
                            }}
                            onClick={() => {
                                setSelectedRoom(v);
                                dispatch(setCurrentChatRoom(v));
                            }}
                            onDoubleClick={
                                selectedRoom.roomPassword
                                    ? openPwModal
                                    : () =>
                                          history.push(
                                              `chat/room/${selectedRoom.id}`
                                          )
                            }
                        >
                            <div
                                style={{
                                    width: "100px",
                                    textAlign: "center",
                                    borderRight: "2px solid #ececec",
                                }}
                            >
                                {v.roomPassword ? (
                                    <AiOutlineLock size={20} />
                                ) : null}
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    borderRight: "2px solid #ececec",
                                }}
                            >
                                {v.roomName}
                            </div>
                            <div
                                style={{
                                    width: "150px",
                                    textAlign: "center",
                                    borderRight: "2px solid #ececec",
                                }}
                            >
                                인원
                            </div>
                            <div
                                style={{ width: "200px", textAlign: "center" }}
                            >
                                {v.createdBy.name}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div
                style={{
                    textAlign: "right",
                }}
            >
                <button
                    style={{
                        backgroundColor: "white",
                        border: ".2rem solid #ececec",
                        padding: "0.5rem",
                        height: "100%",
                        width: "150px",
                        borderRadius: 10,
                        fontSize: 20,
                    }}
                    onClick={openModal}
                >
                    대화방 만들기
                </button>
                <button
                    style={{
                        backgroundColor: "white",
                        border: ".2rem solid #ececec",
                        padding: "0.5rem",
                        height: "100%",
                        width: "150px",
                        borderRadius: 10,
                        marginLeft: 5,
                        fontSize: 20,
                    }}
                    onClick={
                        selectedRoom.roomPassword
                            ? openPwModal
                            : () => history.push(`chat/room/${selectedRoom.id}`)
                    }
                    disabled={
                        selectedRoom.hasOwnProperty("roomName") ? false : true
                    }
                >
                    대화방 입장
                </button>
            </div>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header>
                    <Modal.Title>채팅방 만들기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitAddRoom}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>채팅방 이름 (필수)</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    setChatRoomName(e.target.value);
                                }}
                                type="text"
                                placeholder="채팅방 이름을 입력해주세요."
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>비밀번호 (선택)</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    setChatRoomPw(e.target.value);
                                }}
                                type="text"
                                placeholder="비밀번호를 입력해주세요."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={submitAddRoom}>
                        저장
                    </Button>
                    <Button variant="secondary" onClick={closeModal}>
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPwModal} onHide={closePwModal}>
                <Modal.Header>
                    <Modal.Title>비밀번호</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitRoomPw}>
                        <Form.Group controlId="formBasicPassword">
                            {/* <Form.Label>비밀번호</Form.Label> */}
                            <Form.Control
                                onChange={(e) => {
                                    setPwModal(e.target.value);
                                }}
                                type="text"
                                placeholder="비밀번호를 입력해주세요."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={submitRoomPw}>
                        입장
                    </Button>
                    <Button variant="secondary" onClick={closePwModal}>
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ChatList;
