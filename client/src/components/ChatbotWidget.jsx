import React, { useState, useRef } from 'react';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'Assistant', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: 'You', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'Assistant', text: data.reply || 'No response.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'Assistant', text: 'Sorry, I could not get a response.' }]);
    }
    setLoading(false);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {open ? (
        <div className="w-80 bg-white shadow-2xl rounded-2xl flex flex-col border border-pink-200 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-2xl">
            <span className="font-bold tracking-wide flex items-center gap-2">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2M12 15v-6m0 0l-3 3m3-3l3 3" /></svg>
              Assistant
            </span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200 text-2xl leading-none">×</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto max-h-96 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50" style={{ minHeight: 200 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm shadow ${msg.sender === 'You' ? 'bg-pink-100 text-pink-800' : 'bg-purple-100 text-purple-800'} max-w-[80%]`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="flex border-t border-pink-200 bg-white rounded-b-2xl">
            <input
              type="text"
              className="flex-1 px-3 py-2 outline-none bg-transparent text-gray-700 placeholder-gray-400"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-2xl hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50" disabled={loading || !input.trim()}>
              {loading ? (
                <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Send'}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-2xl p-4 hover:scale-105 transition-transform flex items-center justify-center border-4 border-white"
          title="Open Assistant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2M12 15v-6m0 0l-3 3m3-3l3 3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget; 