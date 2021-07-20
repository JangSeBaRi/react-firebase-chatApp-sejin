import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { setJwtToken, setUserProfile } from '../reducers/user';
import Modal from '../components/Modal'
import { IoIosChatbubbles } from "react-icons/io";
import { GiExitDoor } from "react-icons/gi";
import { GoPlus } from "react-icons/go";
import { db, firebaseApp, firebase } from '../firebase'

const ChatList = () => {

    // useEffect(() => {
        // db.('chatRoom').doc('PutdMdawqShFDbAM7CTl').collection('message').add({
        //     title: 'chatRoom',
        //     content: 'content',
        //     created: '6:30PM',
        //     uidOfChat: 'uidOfChat',
        // })
    // }, [])


    // chatList: [
    //     {
    //         content: 'content',
    //         created: '6:30',
    //         uidOfUser: 'uidOfUser',
    //         uidOfChat: 'uidOfChat',
    // emoticon: [
    //     {
    //         uidOfEmoticon: 'uidOfEmoticon',
    //         url: 'url',
    //         count: 0
    //     }
    // ]
    //     }
    // ]


    // 유저 삭제
    // useEffect(() => {
    //     db.collection('chatRoom').doc("LlhQ2DVea0sS4REHKtmM").delete()
    // }, [])

    // 유저 값 가져오기
    // useEffect(() => {
    //     (async () => {
    //         const ref = await db.collection('chatRoom').doc("0Jfsobm0R8yL5NDMhHuI").get()
    //         console.log(ref.data())
    //     })()
    // }, [])

    // 유저 값 수정하기
    // useEffect(() => {
    //     db.collection('chatRoom').doc("0Jfsobm0R8yL5NDMhHuI").update({
    //         nickName: '새로운 닉네임',
    //         isAgreeInfo: false
    //     })
    // }, [])

    // 유저특정 칼럽 삭제하기
    // useEffect(() => {
    //     db.collection('chatRoom').doc("0Jfsobm0R8yL5NDMhHuI").update({
    //         nickName: firebase.firestore.FieldValue.delete(),
    //     })
    // }, [])

    // useEffect(() => {
    //     (async () => {
    //         const ref = await db.collection('chatRoom').get()
    //     })()
    // }, [])

    // const jwtToken = useSelector((state: any) => state.jwtToken)
    // const userProfile = useSelector((state: any) => state.user.userProfile)

    // useEffect(() => {
    //     if (!jwtToken) {
    //         history.push('/users/login')
    //     }
    // }, [])

    // const history = useHistory();
    // const dispatch = useDispatch();

    // const [showLogout, setShowLogout] = useState(false);
    // const [showAddChatRoom, setShowAddChatRoom] = useState(false);
    // const [chatRoomTitle, setChatRoomTitle] = useState('');
    // const [chatRoomList, setChatRoomList] = useState([]);

    // const onChange_chatRoomTitle = (e) => {
    //     setChatRoomTitle(e.target.value)
    // }

    // const openAddChatRoom = () => {
    //     setShowAddChatRoom(true)
    // }
    // const closeAddChatRoom = () => {
    //     setShowAddChatRoom(false)
    //     setChatRoomTitle('')
    // }
    // const addChatRoomEventHandler = async () => {

    //     await db.collection('chatRoom').add({
    //         title: chatRoomTitle,
    //     })
    //     closeAddChatRoom();
    //     setChatRoomTitle('');
    // db.collection('chatRoom').onSnapshot((snapshot) => {
    //     const data = snapshot.docs.map((doc) => {
    //         return {
    //             id: doc.id,
    //             ...doc.data(),
    //         }
    //     })
    //     let roomData = data.find(value => {return value.title == chatRoomTitle});

    //     // history.push(`/chat/room/${roomData.id}`, {data: roomData})
    // })
    // }

    // const openLogout = () => {
    //     setShowLogout(true)
    // }
    // const closeLogout = () => {
    //     setShowLogout(false)
    // }
    // const logoutHandler = () => {
    //     dispatch(setJwtToken(''))
    //     dispatch(setUserProfile(''))
    //     history.push('/users/login')
    // }

    // useEffect(() => {
    //     db.collection('chatRoom').onSnapshot((snapshot) => {
    //         const data = snapshot.docs.map((doc) => {
    //             return {
    //                 id: doc.id,
    //                 ...doc.data(),
    //             }
    //         })
    //         setChatRoomList(data);
    //     })
    // }, [])


    return (
        // <div className="wrap">
        //     <div className="chat-html">
        //         <h2 className="chat-header">채팅방 목록 <span style={{ color: '#d9d9d9', fontSize: 15 }}>{userProfile.nickName}님 환영합니다.</span>
        //             <IoIosChatbubbles style={{ position: 'absolute', top: 10, right: '10%' }} size={35} color={'white'} onClick={openAddChatRoom} />
        //             <GiExitDoor style={{ position: 'absolute', top: 10, right: '2%' }} size={35} color={'white'} onClick={openLogout} />
        //             <GoPlus style={{ position: 'absolute', top: 17, right: '11.4%' }} size={15} color={'#1C4167'} onClick={openAddChatRoom} />
        //         </h2>
        //         {chatRoomList.map((v, i) => {
        //             return <div className="chat-list" onClick={() => history.push(`/chat/room/${v.id}`, { data: v })}>
        //                 <img src="https://blog.kakaocdn.net/dn/cyOIpg/btqx7JTDRTq/1fs7MnKMK7nSbrM9QTIbE1/img.jpg" alt="My Image" width="60px" style={{ borderRadius: 30 }}></img>
        //                 <div style={{ position: 'absolute', top: 18, left: '20%', display: 'inline-block', width: '75%' }}>
        //                     <div style={{ color: 'black', fontSize: 20 }}>
        //                         {v.title}<span style={{ position: 'absolute', right: 0, color: '#7f7f7f', fontSize: 14 }}>{v.hasOwnProperty('recentDate') ? v.recentDate : ''}</span>
        //                     </div>
        //                     <div className="chat-content">
        //                         {v.hasOwnProperty('recentMessage') ? v.recentMessage : ''}
        //                     </div>
        //                 </div>
        //             </div>
        //         })}
        //     </div>
        //     <Modal open={showAddChatRoom} close={closeAddChatRoom} event={addChatRoomEventHandler} header="채팅방 추가" evnetTitle={'추가'} closeTitle={'취소'}>
        //         <input
        //             style={{ width: '100%', paddingLeft: 5 }}
        //             onChange={onChange_chatRoomTitle}
        //             value={chatRoomTitle}
        //             placeholder="채팅방 이름을 설정해주세요"
        //             onKeyPress={(e) => {
        //                 if (e.key === 'Enter') {
        //                     addChatRoomEventHandler();
        //                 }
        //             }}
        //         />
        //     </Modal>
        //     <Modal open={showLogout} close={closeLogout} event={logoutHandler} header="알림" evnetTitle={'예'} closeTitle={'아니오'}>
        //         로그아웃 하시겠습니까?
        //     </Modal>
        // </div>
        <div onClick={() => {
            firebaseApp.auth().signOut()
        }}>
            채팅방 목록
        </div>
    )
}

export default ChatList