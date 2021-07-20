import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Media from "react-bootstrap/Media";

import mime from "mime-types";
import { FaLockOpen } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChatRoom } from "../reducers/chat";
import { useHistory } from "react-router-dom";

import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import { db, firebaseApp, firebase } from "../firebase";
import moment from "moment";
import { AiTwotoneSetting } from "react-icons/ai";
import { ImExit } from "react-icons/im";

const ChatRoom = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const contentEnd = useRef();
    const inputOpenImageRef = useRef();
    const modifyImageRef = useRef();
    const chatRoom = useSelector((state) => state.chat.currentChatRoom);
    const user = useSelector((state) => state.user.userProfile);
    const isPrivateChatRoom = false;
    const [isFavorited, setIsFavorited] = useState(false);
    const handleFavorite = () => {
        setIsFavorited((prev) => !prev);
    };
    const [percentage, setPercentage] = useState(0);
    const timeFromNow = (timestamp) => moment(timestamp).fromNow();

    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [chatArray, setChatArray] = useState([]);
    const onChangeContent = (e) => {
        setContent(e.target.value);
    };

    // 채팅관련 리스너
    useEffect(() => {
        const chatRef = db
            .collection("chatRoom")
            .doc(chatRoom.id)
            .collection("message");
        chatRef.orderBy("created").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const data = snapshot.docs.map((doc) => {
                    if (doc.data().createdBy.uid == user.uid){
                        return {
                            id: doc.id,
                            ...doc.data(),
                            createdBy: {
                                ...doc.data().createdBy,
                                image: user.photoURL,
                            },
                        };
                    } else {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    }
                    
                });
                setChatArray(data);
            });
        });
    }, []);

    // 현재 채팅을 치고 있는 중인지 알려주는 리스너
    const [typingUsersArray, setTypingUsersArray] = useState([]);
    useEffect(() => {
        const typingRef = db.collection("typingUsers");
        typingRef.orderBy("displayName").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = snapshot.docs
                        .map((doc) => {
                            return {
                                ...doc.data(),
                            };
                        })
                        .map((v, i) => {
                            return v.displayName;
                        })
                        .filter((val) => {
                            return val != user.displayName;
                        });
                    setTypingUsersArray(data);
                } else if (change.type === "removed") {
                    const data = snapshot.docs
                        .map((doc) => {
                            return {
                                ...doc.data(),
                            };
                        })
                        .map((v, i) => {
                            return v.displayName;
                        });
                    setTypingUsersArray(data);
                }
            });
        });
    }, []);

    useEffect(() => {
        contentEnd.current.scrollIntoView({ behavior: "smooth" });
    }, [chatArray.length, typingUsersArray]);

    const submitMessage = async () => {
        if (!content.replace(/\s/gi, "")) {
            alert("메세지를 입력해주세요.");
            return;
        }
        setLoading(true);
        try {
            await db
                .collection("chatRoom")
                .doc(chatRoom.id)
                .collection("message")
                .add({
                    content: content,
                    created: firebase.firestore.Timestamp.now().seconds,
                    createdBy: {
                        uid: user.uid,
                        image: user.photoURL,
                        name: user.displayName,
                    },
                });
            setContent("");
            setLoading(false);
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }

        try {
            await db.collection("typingUsers").doc(user.uid).delete();
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    };

    const onKeyDownContent = (event) => {
        if (event.ctrlKey && event.keyCode === 13) {
            submitMessage();
        }

        if (content.replace(/\s/gi, "")) {
            db.collection("typingUsers").doc(user.uid).set({
                displayName: user.displayName,
                created: firebase.firestore.Timestamp.now().seconds,
            });
        } else {
            db.collection("typingUsers").doc(user.uid).delete();
        }
    };
    // 채팅룸 설정 관련 리스너
    useEffect(() => {
        const chatRoomRef = db.collection("chatRoom");
        chatRoomRef.orderBy("created").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "modified") {
                    const data = snapshot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    });
                    const selectedData = data.filter((v, i) => {
                        return v.id === chatRoom.id;
                    });
                    dispatch(setCurrentChatRoom(selectedData[0]));
                    setNewChatRoomName(selectedData[0].roomName);
                    setNewChatRoomPassword(selectedData[0].roomPassword);
                } else if (change.type === "removed") {
                    history.push("/chat/list");
                    dispatch(setCurrentChatRoom(null));
                }
            });
        });
    }, []);

    const [showSettingModal, setShowSettingModal] = useState(false);
    const [newChatRoomName, setNewChatRoomName] = useState(chatRoom.roomName);
    const [newChatRoomPassword, setNewChatRoomPassword] = useState(
        chatRoom.roomPassword
    );

    const openSettingModal = () => {
        setShowSettingModal(true);
    };
    const closeSettingModal = () => {
        setShowSettingModal(false);
    };
    const submitSetting = async () => {
        try {
            await db.collection("chatRoom").doc(chatRoom.id).update({
                roomName: newChatRoomName,
                roomPassword: newChatRoomPassword,
            });
            closeSettingModal();
        } catch (error) {
            console.log(error.message);
            closeSettingModal();
        }
    };

    const onChangeNewChatRoomName = (e) => {
        setNewChatRoomName(e.target.value);
    };

    const onChangeNewChatRoomPassword = (e) => {
        setNewChatRoomPassword(e.target.value);
    };

    const [showExitModal, setShowExitModal] = useState(false);
    const openExitModal = () => {
        setShowExitModal(true);
    };
    const closeExitModal = () => {
        setShowExitModal(false);
    };
    const exitHandler = async () => {
        try {
            await db.collection("chatRoom").doc(chatRoom.id).delete();
            closeExitModal();
        } catch (error) {
            console.log(error.message);
            closeExitModal();
        }
    };

    const handleUploadImage = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const filePath = `message/public/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name) };

        setLoading(true);
        // 파일을 먼저 스토리지에 저장하기
        let uploadTask = firebase
            .storage()
            .ref()
            .child(filePath)
            .put(file, metadata);
        // 파일 저장되는 퍼센티지 구하기
        //on 의 1번쨰 인자, 두번째 인자(err) , 세번쨰 인자 (complete)
        uploadTask.on(
            "state_changed",
            (UploadTaskSnapshot) => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred /
                        UploadTaskSnapshot.totalBytes) *
                        100
                );
                setPercentage(percentage);
            },
            (err) => {
                setLoading(false);
                console.error(err);
            },
            () => {
                // 저장이 다 된 후에 파일 메시지 전송
                // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
                uploadTask.snapshot.ref
                    .getDownloadURL()
                    .then(async (downloadURL) => {
                        try {
                            await db
                                .collection("chatRoom")
                                .doc(chatRoom.id)
                                .collection("message")
                                .add({
                                    content: content,
                                    image: downloadURL,
                                    created:
                                        firebase.firestore.Timestamp.now()
                                            .seconds,
                                    createdBy: {
                                        uid: user.uid,
                                        image: user.photoURL,
                                        name: user.displayName,
                                    },
                                });
                            setContent("");
                            setLoading(false);
                        } catch (error) {
                            console.log(error.message);
                            setLoading(false);
                        }
                    });
            }
        );
    };

    const handleModifyImage = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const filePath = `message/public/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name) };

        setLoading(true);
        // 파일을 먼저 스토리지에 저장하기
        let uploadTask = firebase
            .storage()
            .ref()
            .child(filePath)
            .put(file, metadata);
        // 파일 저장되는 퍼센티지 구하기
        //on 의 1번쨰 인자, 두번째 인자(err) , 세번쨰 인자 (complete)
        uploadTask.on(
            "state_changed",
            (UploadTaskSnapshot) => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred /
                        UploadTaskSnapshot.totalBytes) *
                        100
                );
                setPercentage(percentage);
            },
            (err) => {
                setLoading(false);
                console.error(err);
            },
            () => {
                // 저장이 다 된 후에 파일 메시지 전송
                // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
                uploadTask.snapshot.ref
                    .getDownloadURL()
                    .then(async (downloadURL) => {
                        try {
                            await db
                                .collection("chatRoom")
                                .doc(chatRoom.id)
                                .collection("message")
                                .doc(selectedMessageId)
                                .update({
                                    image: downloadURL,
                                });
                            setLoading(false);
                        } catch (error) {
                            console.log(error.message);
                            setLoading(false);
                        }
                    });
            }
        );
    };

    // message 수정 부분
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [newContent, setNewContent] = useState("");
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const openModifyModal = () => {
        setShowModifyModal(true);
    };

    const closeModifyModal = () => {
        setShowModifyModal(false);
    };

    const modifyHandler = async () => {
        try {
            await db
                .collection("chatRoom")
                .doc(chatRoom.id)
                .collection("message")
                .doc(selectedMessageId)
                .update({
                    content: newContent,
                });
            setNewContent("");
            closeModifyModal();
        } catch (error) {
            console.log(error.message);
            closeModifyModal();
        }
    };

    const onChangeNewContent = (e) => {
        setNewContent(e.target.value);
    };

    //메세지 삭제 부분
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const deleteHandler = async () => {
        try {
            await db
                .collection("chatRoom")
                .doc(chatRoom.id)
                .collection("message")
                .doc(selectedMessageId)
                .delete();
            closeDeleteModal();
        } catch (error) {
            console.log(error.message);
            closeDeleteModal();
        }
    };

    return (
        <div style={{ padding: "2rem 2rem 0 2rem" }}>
            <div
                style={{
                    width: "100%",
                    height: "130px",
                    border: ".2rem solid #ececec",
                    borderRadius: "4px",
                    padding: "1rem",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                    marginBottom: "1rem",
                }}
            >
                <Row>
                    <Col>
                        <h2>
                            {chatRoom.roomPassword ? (
                                <FaLock style={{ marginBottom: "10px" }} />
                            ) : (
                                <FaLockOpen style={{ marginBottom: "10px" }} />
                            )}{" "}
                            {chatRoom && chatRoom.roomName}
                            {!isPrivateChatRoom && (
                                <span
                                    style={{
                                        cursor: "pointer",
                                        position: "relative",
                                        top: -3,
                                        marginLeft: 30,
                                    }}
                                    onClick={handleFavorite}
                                >
                                    {isFavorited ? (
                                        <MdFavorite color="#636ee6" />
                                    ) : (
                                        <MdFavoriteBorder />
                                    )}
                                </span>
                            )}
                            {chatRoom.createdBy.uid === user.uid && (
                                <span>
                                    <AiTwotoneSetting
                                        size={25}
                                        style={{
                                            cursor: "pointer",
                                            marginLeft: 10,
                                            position: "relative",
                                            top: -3,
                                        }}
                                        onClick={openSettingModal}
                                    />
                                    <ImExit
                                        size={25}
                                        style={{
                                            cursor: "pointer",
                                            marginLeft: 12,
                                            position: "relative",
                                            top: -2,
                                        }}
                                        onClick={openExitModal}
                                    />
                                </span>
                            )}
                        </h2>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    <AiOutlineSearch />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                // onChange={handleSearchChange}
                                placeholder="Search Messages"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <p style={{ fontWeight: "bold" }}>
                        {/* <Image
                            style={{ width: "40px", height: "40px" }}
                            src={chatRoom && chatRoom.createdBy.image}
                            roundedCircle
                        /> */}
                        {"방장: "}
                        {chatRoom && chatRoom.createdBy.name}
                    </p>
                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    height: "450px",
                    border: ".2rem solid #ececec",
                    borderRadius: "4px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    overflowY: "auto",
                }}
                className="hide-scroll"
            >
                {/* {searchTerm
                    ? this.renderMessages(searchResults)
                    : this.renderMessages(messages)} */}
                {/* {this.renderTypingUsers(typingUsers)} */}
                {chatArray.map((v, i) => {
                    return (
                        <Media
                            style={{
                                marginBottom: "3px",
                                position: "relative",
                            }}
                            key={i}
                        >
                            <img
                                style={{
                                    borderRadius: "24px",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                                width={48}
                                height={48}
                                className="mr-3"
                                src={v.createdBy.image}
                                alt={v.createdBy.name}
                            />
                            <Media.Body
                                style={{
                                    backgroundColor:
                                        v.createdBy.uid === user.uid
                                            ? "#f6f6f6"
                                            : "white",
                                    border: ".2rem solid #ececec",
                                    marginLeft: "53px",
                                }}
                            >
                                <h6>
                                    {v.createdBy.name}{" "}
                                    <span
                                        style={{
                                            fontSize: "10px",
                                            color: "gray",
                                        }}
                                    >
                                        {timeFromNow(v.created)}
                                    </span>
                                    {chatRoom.createdBy.uid === user.uid ? (
                                        <span>
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "10px",
                                                    color: "gray",
                                                    marginLeft: "5px",
                                                }}
                                                onClick={() => {
                                                    setNewContent(v.content);
                                                    setSelectedMessageId(v.id);
                                                    openModifyModal();
                                                }}
                                            >
                                                수정
                                            </span>
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "10px",
                                                    color: "gray",
                                                    marginLeft: "5px",
                                                }}
                                                onClick={() => {
                                                    setSelectedMessageId(v.id);
                                                    modifyImageRef.current.click();
                                                }}
                                            >
                                                {v.hasOwnProperty("image")
                                                    ? "이미지수정"
                                                    : "이미지추가"}
                                            </span>
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "10px",
                                                    color: "gray",
                                                    marginLeft: "5px",
                                                }}
                                                onClick={() => {
                                                    setSelectedMessageId(v.id);
                                                    openDeleteModal();
                                                }}
                                            >
                                                삭제
                                            </span>
                                        </span>
                                    ) : user.uid == v.createdBy.uid ? (
                                        <span>
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "10px",
                                                    color: "gray",
                                                    marginLeft: "5px",
                                                }}
                                                onClick={() => {
                                                    setNewContent(v.content);
                                                    setSelectedMessageId(v.id);
                                                    openModifyModal();
                                                }}
                                            >
                                                수정
                                            </span>
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "10px",
                                                    color: "gray",
                                                    marginLeft: "5px",
                                                }}
                                                onClick={() => {
                                                    setSelectedMessageId(v.id);
                                                    modifyImageRef.current.click();
                                                }}
                                            >
                                                {v.hasOwnProperty("image")
                                                    ? "이미지수정"
                                                    : "이미지추가"}
                                            </span>
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                    fontSize: "10px",
                                                    color: "gray",
                                                    marginLeft: "5px",
                                                }}
                                                onClick={() => {
                                                    setSelectedMessageId(v.id);
                                                    openDeleteModal();
                                                }}
                                            >
                                                삭제
                                            </span>
                                        </span>
                                    ) : null}
                                </h6>
                                {v.hasOwnProperty("image") ? (
                                    <div>
                                        <img
                                            style={{ maxWidth: "300px" }}
                                            alt="이미지"
                                            src={v.image}
                                        />
                                        <p>{v.content}</p>
                                    </div>
                                ) : (
                                    <p>{v.content}</p>
                                )}
                            </Media.Body>
                        </Media>
                    );
                })}
                {typingUsersArray.length > 0 ? (
                    <span>
                        {typingUsersArray.join(",")}님이 채팅을 입력하고
                        있습니다...
                    </span>
                ) : null}

                <div ref={contentEnd} />
            </div>
            <div>
                <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control
                            onKeyDown={onKeyDownContent}
                            value={content}
                            onChange={onChangeContent}
                            as="textarea"
                            rows={3}
                        />
                    </Form.Group>
                </Form>

                {!(percentage === 0 || percentage === 100) && (
                    <ProgressBar
                        variant="warning"
                        label={`${percentage}%`}
                        now={percentage}
                    />
                )}

                <Row style={{ marginTop: 15 }}>
                    <Col>
                        <button
                            onClick={submitMessage}
                            type="submit"
                            style={{ width: "100%" }}
                            disabled={loading ? true : false}
                        >
                            SEND
                        </button>{" "}
                    </Col>
                    <Col>
                        <button
                            onClick={handleOpenImageRef}
                            type="submit"
                            style={{ width: "100%" }}
                            disabled={loading ? true : false}
                        >
                            UPLOAD IMAGE
                        </button>{" "}
                    </Col>
                </Row>

                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    ref={inputOpenImageRef}
                    style={{ display: "none" }}
                    onChange={handleUploadImage}
                />
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    ref={modifyImageRef}
                    style={{ display: "none" }}
                    onChange={handleModifyImage}
                />
                <Modal show={showSettingModal} onHide={closeSettingModal}>
                    <Modal.Header>
                        <Modal.Title>방 설정</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>채팅방 이름변경</Form.Label>
                            <Form.Control
                                onChange={onChangeNewChatRoomName}
                                value={newChatRoomName}
                                type="text"
                                placeholder="채팅방 이름을 입력해주세요."
                            />
                        </Form.Group>
                        <Form onSubmit={submitSetting}>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>비밀번호 변경</Form.Label>
                                <Form.Control
                                    onChange={onChangeNewChatRoomPassword}
                                    value={newChatRoomPassword}
                                    type="text"
                                    placeholder="비밀번호를 입력해주세요."
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={submitSetting}>
                            변경
                        </Button>
                        <Button variant="secondary" onClick={closeSettingModal}>
                            취소
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showExitModal} onHide={closeExitModal}>
                    <Modal.Header>
                        <Modal.Title>채팅방을 삭제하시겠습니까?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="primary" onClick={exitHandler}>
                            예
                        </Button>
                        <Button variant="secondary" onClick={closeExitModal}>
                            아니오
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showModifyModal} onHide={closeModifyModal}>
                    <Modal.Header>
                        <Modal.Title>메세지 수정</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>메세지 내용 수정</Form.Label>
                            <Form.Control
                                onChange={onChangeNewContent}
                                value={newContent}
                                type="text"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={modifyHandler}>
                            변경
                        </Button>
                        <Button variant="secondary" onClick={closeModifyModal}>
                            취소
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showDeleteModal} onHide={closeDeleteModal}>
                    <Modal.Header>
                        <Modal.Title>채팅을 삭제하시겠습니까?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="primary" onClick={deleteHandler}>
                            예
                        </Button>
                        <Button variant="secondary" onClick={closeDeleteModal}>
                            아니오
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ChatRoom;
