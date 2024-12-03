'use client';
import React, { useState } from 'react';

// Mock data for users
const mockUsers = [
  { username: 'alice', name: 'Alice' },
  { username: 'bob', name: 'Bob' },
  { username: 'charlie', name: 'Charlie' },
];

type Message = {
  sender: string;
  receiver: string;
  message: string;
};

const CommunityPage: React.FC = () => {
  const [users] = useState(mockUsers); // Removed setUsers since we don't need to modify users
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string>(''); // You can keep this for future use
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState<string>('');

  const handleMessageSend = () => {
    if (!selectedUser || !messageText) return;
    const newMessage: Message = {
      sender: currentUsername,
      receiver: selectedUser,
      message: messageText,
    };
    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const handleSelectUser = (username: string) => {
    setSelectedUser(username);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Community Chat</h1>
      </header>

      {/* User List */}
      <div className="flex flex-wrap mb-6">
        <div className="w-full md:w-1/4 p-2">
          <h2 className="font-bold mb-4">Users</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            {users.map((user) => (
              <div
                key={user.username}
                onClick={() => handleSelectUser(user.username)}
                className={`p-2 mb-2 cursor-pointer rounded ${
                  selectedUser === user.username ? 'bg-blue-200' : 'bg-gray-100'
                }`}
              >
                {user.name} ({user.username})
              </div>
            ))}
          </div>
        </div>

        {/* Message Box */}
        <div className="w-full md:w-3/4 p-2">
          {selectedUser ? (
            <>
              <h2 className="font-bold mb-4">Send Message to {selectedUser}</h2>
              <div className="bg-white p-4 rounded-lg shadow-md">
                {/* Message List */}
                <div className="mb-4 max-h-60 overflow-y-auto">
                  {messages
                    .filter(
                      (msg) =>
                        (msg.sender === currentUsername && msg.receiver === selectedUser) ||
                        (msg.receiver === currentUsername && msg.sender === selectedUser)
                    )
                    .map((msg, index) => (
                      <div key={index} className="mb-2">
                        <strong>{msg.sender}:</strong>
                        <p>{msg.message}</p>
                      </div>
                    ))}
                </div>

                {/* Message Input */}
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  rows={4}
                  className="w-full p-2 border rounded mb-4"
                />
                <button
                  onClick={handleMessageSend}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Send Message
                </button>
              </div>
            </>
          ) : (
            <div>Select a user to start a conversation.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
