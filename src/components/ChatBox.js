import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import { Avatar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import SendIcon from '@material-ui/icons/Send';
import { useAuth } from './useAuth';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import Moment from 'react-moment';
import firebase from 'firebase';

const ChatBox = () => {
  let { roomId } = useParams();
  const [text, setText] = useState('');
  const [roomInfo, setRoomInfo] = useState({});
  const [messages, setMessages] = useState();
  const [lastSeen, setLastSeen] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection('rooms').doc(roomId).collection('messages').add({
      name: auth.user.displayName,
      uid: auth.user.uid,
      message: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setText('');
    console.log(
      window.scrollTo(0, document.querySelector('.chatBox__body').scrollHeight)
    );
  };

  const auth = useAuth();

  useEffect(() => {
    if (roomId) {
      db.collection('rooms')
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomInfo(snapshot.data()));

      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
          );
        });

      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setLastSeen(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomId]);

  return (
    <div className="chatBox">
      <div className="chatBox__header">
        <div className="chatBox__header__container">
          <div className="chatBox__headerLeft">
            <Avatar src={roomInfo.avatar} alt={roomInfo.name} />
            <div className="chatBox__headerLeft__info">
              <p className="username">{roomInfo.name}</p>
              <p className="seen__details">
                <Moment format="llll">
                  {lastSeen[0]?.timestamp &&
                    new Date(lastSeen[0]?.timestamp?.toDate())}
                </Moment>
              </p>
            </div>
          </div>
          <div className="chatBox__headerRight">
            <IconButton>
              <SearchIcon />
            </IconButton>
            <IconButton>
              <AttachFileIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="chatBox__body">
        <div className="chatBox__message__container">
          {messages?.map(({ id, message }) => (
            <p
              key={id}
              className={`chatBox__message ${
                auth.user.displayName === message.name && 'chatBox__receive'
              }`}
            >
              <span className="chatBox__name">{message.name}</span>
              {message.message}
              <span className="chatBox__timestamp">
                <Moment format="llll">
                  {new Date(message.timestamp?.toDate())}
                </Moment>
              </span>
            </p>
          ))}
        </div>
      </div>

      <div className="chatBox__footer">
        <div className="chatBox__footer__container">
          <IconButton>
            <InsertEmoticonIcon className="footer__icon" />
          </IconButton>
          <form>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
            />

            <button type="submit" onClick={sendMessage}>
              <SendIcon
                className="send"
                style={{ display: text ? 'block' : 'none' }}
              />
            </button>
          </form>
          <IconButton>
            <KeyboardVoiceIcon className="footer__icon" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
