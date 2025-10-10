import React from 'react';
import Chat from './Chat';

const StudentChatPage = ({ username }) => {
  return <Chat username={username} role="student" />;
};

export default StudentChatPage;