// import React, { useEffect, useState } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
// import { BiArrowBack } from "react-icons/bi";
// import { GiExitDoor } from "react-icons/gi";
// import { db, firebaseApp, firebase } from '../firebase'
// import { useDispatch, useSelector } from 'react-redux'
// import Modal from '../components/Modal'
// import { AiFillLike, AiFillDislike } from "react-icons/ai";

// const ChatRoom = (props) => {
//     const history = useHistory();
//     const chatRoomData = props.location.state.data
//     const jwtToken = useSelector((state: any) => state.user.jwtToken)
//     const userProfile = useSelector((state: any) => state.user.userProfile)
//     const [participantNickNames, setParticipantNickNames] = useState([])
//     const [message, setMessage] = useState('')
//     const onChangeMessage = (e) => {
//         setMessage(e.target.value)
//     }
//     const numberPad = (n, width) => {
//         n = n + '';
//         return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
//     };
//     const onSendMessage = (e) => {
//         if (e.key === 'Enter') {
//             (async () => {
//                 await db.collection('chatRoom').doc(chatRoomData.id).collection('message').add({
//                     content: message,
//                     created: new Date().getTime(),
//                     uidOfChat: jwtToken,
//                     nickName: userProfile.nickName,
//                     date: `${numberPad(new Date().getHours(), 2)} : ${numberPad(new Date().getMinutes(), 2)}`,
//                     likeCount: 0,
//                     unlikeCount: 0,
//                 })
//                 db.collection('chatRoom').doc(chatRoomData.id).collection('Participants').onSnapshot((e) => {
//                     const participantsData = e.docs.map((doc) => {
//                         return {
//                             id: doc.id,
//                             ...doc.data(),
//                         }
//                     })
//                     if (participantsData.filter(value => {
//                         return value.uid === jwtToken;
//                     }).length === 0) {
//                         (async () => {
//                             await db.collection('chatRoom').doc(chatRoomData.id).collection('Participants').add({
//                                 uid: jwtToken,
//                                 nickName: userProfile.nickName
//                             })
//                         })()
//                     }
//                 })
//                 setMessage('')
//             })()
//         }
//     }

//     const [chatList, setChatList] = useState([]);

//     useEffect(() => {
//         db.collection('chatRoom').doc(chatRoomData.id).collection('message').onSnapshot((snapshot) => {
//             const data = snapshot.docs.map((doc) => {
//                 return {
//                     id: doc.id,
//                     ...doc.data(),
//                 }
//             })
//             const sortedData = data.sort((a, b) => {
//                 return a.created < b.created ? -1 : 1;
//             })
//             setChatList(sortedData)
//             if (sortedData.length != 0) {
//                 db.collection('chatRoom').doc(chatRoomData.id).update({
//                     recentMessage: sortedData[sortedData.length - 1].content,
//                     recentDate: sortedData[sortedData.length - 1].date
//                 })
//             }
//             document.getElementById("messageBox").scrollTop = document.getElementById("messageBox").scrollHeight
//         })
//         db.collection('chatRoom').doc(chatRoomData.id).collection('Participants').onSnapshot((e) => {
//             const participantsData = e.docs.map((doc) => {
//                 return {
//                     id: doc.id,
//                     ...doc.data(),
//                 }
//             })
//             if (participantsData.length > 0) {
//                 setParticipantNickNames(participantsData.map((v, i) => {
//                     return v.nickName
//                 }))
//             }
//         })
//     }, [])

//     const [showDelete, setShowDelete] = useState(false)
//     const [showModify, setShowModify] = useState(false)
//     const [messageId, setMessageId] = useState('')
//     const [modifiedMessage, setModifiedMessage] = useState('')

//     const onChange_modifiedMessage = (e) => {
//         setModifiedMessage(e.target.value);
//     }

//     const openDelete = () => {
//         setShowDelete(true)
//     }

//     const closeDelete = () => {
//         setShowDelete(false)
//     }

//     const deleteHandler = () => {
        // db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(messageId).delete()
        // closeDelete();
//     }

//     const openModify = () => {
//         setShowModify(true)
//     }

//     const closeModify = () => {
//         setShowModify(false)
//         setModifiedMessage('')
//     }

//     const ModifyHandler = () => {
        // db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(messageId).update({
        //     content: modifiedMessage,
        // })
        // closeModify();
//     }

//     const [showLeave, setShowLeave] = useState(false);
//     const openLeave = () => {
//         setShowLeave(true)
//     }
//     const closeLeave = () => {
//         setShowLeave(false)
//     }
//     const leaveHandler = () => {
//         // db.collection('chatRoom').doc(chatRoomData.id).collection('Participants').onSnapshot((e) => {
//         //     const participantsData = e.docs.map((doc) => {
//         //         return {
//         //             id: doc.id,
//         //             ...doc.data(),
//         //         }
//         //     })
//         //     const participantId = participantsData.filter(v => {
//         //         return v.uid === jwtToken
//         //     })[0].id
//         //     db.collection('chatRoom').doc(chatRoomData.id).collection('Participants').doc(participantId).delete()
//         // })
//         closeLeave();
//     }

//     const [isLike, setIsLike] = useState(
//         chatList.map((v, i) => {
//             return false
//         })
//     )

//     const changeStateOfLike = chatList.map((v, i) => {
//         return () => {
//             let likeArr = [...isLike];
//             likeArr[i] = !likeArr[i];
//             setIsLike(likeArr)
//         }
//     })
//     const [isUnlike, setIsUnlike] = useState(
//         chatList.map((v, i) => {
//             return false
//         })
//     )

//     const changeStateOfUnlike = chatList.map((v, i) => {
//         return () => {
//             let unlikeArr = [...isUnlike];
//             unlikeArr[i] = !unlikeArr[i];
//             setIsUnlike(unlikeArr)
//         }
//     })

//     return (
//         <div className="wrap">
//             <div className="chat-html">
//                 <div className="chatroom-header">
//                     <BiArrowBack size={25} color={'white'} onClick={() => history.push('/chat/list')} />
//                     <span className="chatroom-headerTitle">{`${chatRoomData.title}`} <span style={{ fontSize: 13, display: 'inline-block', maxWidth: 180, }}>{`(참가자 ${participantNickNames})(${participantNickNames.length})`}</span></span>
//                     <GiExitDoor size={30} color={'white'} onClick={openLeave} style={{ position: 'absolute', right: 15, top: 10 }} />
//                 </div>
//                 <div className="message-container" id="messageBox">
//                     {chatList.map((v, i) => {
//                         let messageType = v.uidOfChat === jwtToken ? "myMessage" : "otherMessage"
//                         let likeColor = isLike[i] ? '#056BE1' : ''
//                         let unlikeColor = isUnlike[i] ? '#056BE1' : ''
//                         return <div className={messageType}>
//                             <div>
//                                 {messageType === "myMessage" ?
//                                     <div className="name">
//                                         <AiFillLike size={15} color={likeColor} onClick={isLike[i] ? () => {
//                                             (async () => {
//                                                 const ref = await db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).get()
//                                                 db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).update({
//                                                     likeCount: ref.data().likeCount - 1,
//                                                 })
//                                             })()
//                                             changeStateOfLike[i]()
//                                         } : () => {
//                                             (async () => {
//                                                 const ref = await db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).get()
//                                                 db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).update({
//                                                     likeCount: ref.data().likeCount + 1,
//                                                 })
//                                             })()
//                                             changeStateOfLike[i]()
//                                         }} /><span>{v.likeCount}</span> <AiFillDislike size={15} color={unlikeColor} onClick={isUnlike[i] ? () => {
//                                             (async () => {
//                                                 const ref = await db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).get()
//                                                 db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).firebase.firestore.Timestamp.now().seconds
//                                                     unlikeCount: ref.data().unlikeCount - 1,
//                                                 })
//                                             })()
//                                             changeStateOfUnlike[i]()
//                                         } : () => {
//                                             (async () => {
//                                                 const ref = await db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).get()
//                                                 db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).update({
//                                                     unlikeCount: ref.data().unlikeCount + 1,
//                                                 })
//                                             })()
//                                             changeStateOfUnlike[i]()
//                                         }} /> <span>{v.unlikeCount}</span> <span style={{ color: '#F4F5F7' }}>{v.nickName}</span>
//                                     </div>
//                                     :
//                                     <div className="name">
//                                         <span style={{ color: '#F4F5F7' }}>{v.nickName}</span> <AiFillLike size={15} color={likeColor} onClick={isLike[i] ? () => {
//                                             (async () => {
//                                                 const ref = await db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).get()
//                                                 db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).update({
//                                                     likeCount: ref.data().likeCount - 1,
//                                                 })
//                                             })()
//                                             changeStateOfLike[i]()
//                                         } : () => {
//                                             (async () => {
//                                                 const ref = await db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).get()
//                                                 db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).update({
//                                                     likeCount: ref.data().likeCount + 1,
//                                                 })
//                                             })()
//                                             changeStateOfLike[i]()
//                                         }} /><span>{v.likeCount}</span> <AiFillDislike size={15} color={unlikeColor} onClick={isUnlike[i] ? () => {
//                                             (async () => {
//                                                 const ref = await db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).get()
//                                                 db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).update({
//                                                     unlikeCount: ref.data().unlikeCount - 1,
//                                                 })
//                                             })()
//                                             changeStateOfUnlike[i]()
//                                         } : () => {
//                                             (async () => {
//                                                 const ref = await db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).get()
//                                                 db.collection('chatRoom').doc(chatRoomData.id).collection('message').doc(v.id).update({
//                                                     unlikeCount: ref.data().unlikeCount + 1,
//                                                 })
//                                             })()
//                                             changeStateOfUnlike[i]()
//                                         }} /> <span>{v.unlikeCount}</span>
//                                     </div>
//                                 }
//                                 <div className="content">
//                                     {v.content}
//                                 </div>
//                                 {messageType === "myMessage" ? <div className="time">
//                                     <img src="https://blog.kakaocdn.net/dn/cyOIpg/btqx7JTDRTq/1fs7MnKMK7nSbrM9QTIbE1/img.jpg" alt="My Image" width="30px"></img>
//                                     {v.date}<span style={{ marginLeft: 5 }} onClick={() => {
//                                         openDelete();
//                                         setMessageId(v.id)
//                                     }}>삭제</span>
//                                     <span style={{ marginLeft: 5 }} onClick={() => {
//                                         setModifiedMessage(v.content)
//                                         setMessageId(v.id);
//                                         openModify();
//                                     }}>수정</span>
//                                 </div> : <div className="time">
//                                     <img src="https://blog.kakaocdn.net/dn/cyOIpg/btqx7JTDRTq/1fs7MnKMK7nSbrM9QTIbE1/img.jpg" alt="My Image" width="30px"></img>
//                                     {v.date}
//                                 </div>
//                                 }
//                             </div>
//                         </div>
//                     })}
//                 </div>
//                 <input
//                     onChange={onChangeMessage}
//                     value={message}
//                     placeholder="Enter message"
//                     onKeyPress={onSendMessage}
//                 />
//             </div>
//             <Modal open={showModify} close={closeModify} event={ModifyHandler} header="메세지 수정" evnetTitle={'확인'} closeTitle={'취소'}>
//                 <input
//                     style={{ width: '100%', paddingLeft: 5 }}
//                     value={modifiedMessage}
//                     onChange={onChange_modifiedMessage}
//                     onKeyPress={(e) => {
//                         if (e.key === 'Enter') {
//                             ModifyHandler();
//                         }
//                     }}
//                 />
//             </Modal>
//             <Modal open={showDelete} close={closeDelete} event={deleteHandler} header="알림" evnetTitle={'예'} closeTitle={'아니오'}>
//                 삭제 하시겠습니까?
//             </Modal>
//             <Modal open={showLeave} close={closeLeave} event={leaveHandler} header="알림" evnetTitle={'예'} closeTitle={'아니오'}>
//                 채팅방을 나가시겠습니까?
//             </Modal>
//         </div>
//     )
// };

// export default ChatRoom;

import React from 'react';

const ChatRoom = () => {
    return (
        <div>
            채팅방 리스트
        </div>
    );
};

export default ChatRoom;