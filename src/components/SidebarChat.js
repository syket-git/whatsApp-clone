import React, { useEffect, useState, Fragment } from 'react';
import './SidebarChat.css';
import { Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

const SidebarChat = ({ id, avatar, name }) => {
  const [messages, setMessages] = useState('');
  useEffect(() => {
    if (id) {
      db.collection('rooms')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  function truncate(str, no_words) {
    return str?.split(' ').splice(0, no_words).join(' ');
  }

  return (
    <Fragment>
      <Link
        style={{ textDecoration: 'none', color: 'black' }}
        to={`/chat/${id}`}
      >
        <div className="sidebarChat">
          <div className="sidebarChat__container">
            <Avatar src={avatar} alt={name} />
            <div className="sidebarChat__info">
              <p className="username">{name}</p>
              <p className="seen__details">
                {truncate(messages[0]?.message, 5)}
                {messages[0]?.message?.split(' ').length >= 5 && '...'}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <Link
        style={{ textDecoration: 'none', color: 'black' }}
        to={`/chat/${id}`}
      >
        <div className="responsive__sidebarChat">
          <Avatar src={avatar} alt={name} />
        </div>
      </Link>
    </Fragment>
  );
};

export default SidebarChat;
