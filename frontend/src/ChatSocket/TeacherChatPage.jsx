import React from 'react';
import Chat from './Chat';

const TeacherChatPage = ({ username }) => {
  return <Chat username={username} role="teacher" />;
};

export default TeacherChatPage;