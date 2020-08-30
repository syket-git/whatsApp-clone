import React, { useState, Fragment } from 'react';
import './Sidebar.css';
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import SidebarChat from './SidebarChat';
import { useAuth } from './useAuth';
import { useEffect } from 'react';
import { db } from '../firebase';

const Sidebar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [rooms, setRooms] = useState();
  const [filterRoom, setFilterRoom] = useState();
  const [searchRoom, setSearchRoom] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const auth = useAuth();

  useEffect(() => {
    db.collection('rooms').onSnapshot((snapshot) => {
      setRooms(snapshot.docs.map((doc) => ({ id: doc.id, room: doc.data() })));
    });

    if (searchRoom) {
      const filteredRooms = rooms?.filter(
        ({ id, room }) => room.email !== auth.user.email
      );
      setFilterRoom(filteredRooms);

      const searchedRoom = filteredRooms?.filter(({ id, room }) =>
        room.name.toLowerCase().includes(searchRoom.toLowerCase())
      );
      setFilterRoom(searchedRoom);
    } else {
      const filteredRooms = rooms?.filter(
        ({ id, room }) => room.email !== auth.user.email
      );
      setFilterRoom(filteredRooms);
    }
  }, [searchRoom, auth.user.email, rooms]);

  return (
    <Fragment>
      <div className="sidebar">
        <div className="sidebar__header__container">
          <div className="sidebar__header">
            <Avatar
              onClick={handleClick}
              src={auth.user?.photoURL}
              alt={auth.user?.displayName}
            />
            <div className="sidebar__headerRight">
              <IconButton>
                <DonutLargeIcon />
              </IconButton>
              <IconButton>
                <ChatIcon />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>Name: {auth.user.displayName}</MenuItem>
            <MenuItem>Email: {auth.user.email}</MenuItem>
            <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
          </Menu>
        </div>
        <div className="sidebar__search__container">
          <div className="sidebar__search">
            <SearchIcon className="sidebar__searchButton" />
            <input
              type="text"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              placeholder="Search people"
            />
          </div>
        </div>
        <div className="sidebar__chat">
          {filterRoom?.map(({ id, room }) => (
            <SidebarChat
              key={id}
              id={id}
              name={room.name}
              avatar={room.avatar}
            />
          ))}
        </div>
      </div>
      <div className="responsive__sidebar">
        <div className="responsive__sidebar__profile">
          <Avatar
            onClick={handleClick}
            src={auth.user?.photoURL}
            alt={auth.user?.displayName}
          />
        </div>
        <div className="responsive__sidebar__chat">
          {filterRoom?.map(({ id, room }) => (
            <SidebarChat
              key={id}
              id={id}
              name={room.name}
              avatar={room.avatar}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
