import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Send, User as UserIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [notice, setNotice] = useState('');
  const messagesEndRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchContacts();
    // Simple polling for new messages every 5 seconds
    const interval = setInterval(() => {
      if(selectedContact) fetchMessages(selectedContact._id, false);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedContact, user]);

  async function fetchContacts() {
    try {
      const res = await api.get('/messages/contacts');
      const baseContacts = res.data || [];
      const filteredContacts = user?.role === 'tutor'
        ? baseContacts.filter((contact) => contact.role === 'student')
        : baseContacts;
      setContacts(filteredContacts);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const preferredContactId = searchParams.get('contact');
    if (!preferredContactId || selectedContact) return;

    const preferredContact = contacts.find((contact) => contact._id === preferredContactId);
    if (preferredContact) {
      setSelectedContact(preferredContact);
      fetchMessages(preferredContact._id);
    }
  }, [contacts, searchParams, selectedContact]);

  async function fetchMessages(contactId, scroll = true) {
    try {
      const res = await api.get(`/messages/${contactId}`);
      setMessages(res.data);
      if(scroll) scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  }

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;
    try {
      const payload = { receiverId: selectedContact._id, content: newMessage };
      const res = await api.post('/messages', payload);
      setMessages([...messages, res.data]);
      setNewMessage('');
      scrollToBottom();
      
      // If contact not in list yet, refetch contacts
      if (!contacts.some(c => c._id === selectedContact._id)) {
         fetchContacts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    try {
      const res = await api.post('/messages/announcement', { content: announcement.trim() });
      setNotice(`Announcement sent to ${res.data.recipients} students.`);
      setAnnouncement('');
    } catch (error) {
      setNotice(error.response?.data?.message || 'Failed to send announcement');
    }
  };

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Sidebar Contacts */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
        {user?.role === 'tutor' && (
          <div className="p-3 border-b border-gray-100 bg-indigo-50/60">
            <form onSubmit={handleAnnouncement} className="space-y-2">
              <p className="text-xs font-semibold text-indigo-700">Common Announcement</p>
              <textarea
                rows="2"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Send one message to all booked students"
                className="w-full rounded-xl border border-indigo-100 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                disabled={!announcement.trim()}
              >
                Send To All
              </button>
            </form>
            {notice && <p className="text-xs mt-2 text-indigo-700">{notice}</p>}
          </div>
        )}
        <div className="p-4 border-b border-gray-100 bg-white">
           <h2 className="text-xl font-bold text-gray-900">{user?.role === 'tutor' ? 'Booked Students' : 'Chats'}</h2>
        </div>
        <div className="flex-1 overflow-y-auto w-full">
           {contacts.length > 0 ? contacts.map(contact => (
             <button 
               key={contact._id} 
               onClick={() => handleSelectContact(contact)}
               className={`w-full p-4 flex items-center gap-3 text-left border-b border-gray-50 transition-colors ${selectedContact?._id === contact._id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-gray-50'}`}
             >
               <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">
                  {contact.name.charAt(0)}
               </div>
               <div>
                  <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{contact.role}</p>
               </div>
             </button>
           )) : (
             <div className="p-6 text-center text-gray-400 text-sm">No conversations found.</div>
           )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col bg-slate-50/50">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-100 bg-white flex items-center shadow-sm z-10">
               <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mr-3 shrink-0">
                  {selectedContact.name.charAt(0)}
               </div>
               <div>
                 <h3 className="font-bold text-gray-900">{selectedContact.name}</h3>
                 <p className="text-xs text-green-500 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online</p>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {messages.map((msg) => {
                const isMe = msg.senderId === user._id || msg.senderId === user.userId;
                return (
                  <div key={msg._id} className={`flex max-w-[75%] ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
               <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                 <input 
                   type="text" 
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   placeholder="Type your message..." 
                   className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                 />
                 <button type="submit" className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition shadow-md shrink-0" disabled={!newMessage.trim()}>
                   <Send className="w-5 h-5" />
                 </button>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <UserIcon className="w-8 h-8"/>
             </div>
             <p className="font-semibold text-gray-900">Select a conversation</p>
             <p className="text-sm">Choose a contact from the left menu to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
