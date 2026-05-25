import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this for navigation

function Chatbox() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI GovAssistant. Ask me about any scheme!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const msgEndRef = useRef(null);

  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported");
    const recognition = new SpeechRecognition();
    recognition.start();
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
  };

  // --- AI LOGIC WITH LIVE API FETCH ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { text: userText, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      let botReply = "";
      const query = userText.toLowerCase();

      // 1. Check for Category Keywords
      const categories = ["farmer", "student", "women", "healthcare", "business"];
      const detectedCategory = categories.find(cat => query.includes(cat));

      if (detectedCategory) {
        // FETCH LIVE DATA FROM FLASK
        const res = await axios.get("http://127.0.0.1:5000/api/schemes");
        const matches = res.data.filter(s => 
          s.category.toLowerCase().includes(detectedCategory) || 
          s.description.toLowerCase().includes(detectedCategory)
        );

        if (matches.length > 0) {
          botReply = `I found ${matches.length} schemes for ${detectedCategory}s: \n`;
          setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);
          
          // Display matches as individual clickable items
          matches.forEach(m => {
            setMessages(prev => [...prev, { 
              text: `🔗 ${m.name}`, 
              sender: "bot", 
              isLink: true, 
              linkId: m.id 
            }]);
          });
          setIsTyping(false);
          return;
        } else {
          botReply = `I couldn't find any live schemes for ${detectedCategory}s right now.`;
        }
      } 
      // 2. Generic Intelligent Replies
      else if (query.includes("aadhaar") || query.includes("upload")) {
        botReply = "You can manage your documents in the 'Digital Identity & Vault' section of your profile.";
      } else if (query.includes("status") || query.includes("track")) {
        botReply = "Check your 'My Dashboard' to see the live tracking stepper for your applications.";
      } else {
        botReply = "I'm here to help! Try asking: 'Show me schemes for students' or 'How do I check my status?'";
      }

      setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the database.", sender: "bot" }]);
    }
    setIsTyping(false);
  };

  const styles = {
    launcher: { position: "fixed", bottom: "30px", right: "30px", width: "60px", height: "60px", background: "#1e3a8a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 1000, fontSize: "24px", color: "white" },
    chatWindow: { position: "fixed", bottom: "100px", right: "30px", width: "360px", height: "500px", background: "white", borderRadius: "20px", boxShadow: "0 15px 50px rgba(0,0,0,0.2)", display: isOpen ? "flex" : "none", flexDirection: "column", zIndex: 1000, overflow: "hidden", border: "1px solid #e2e8f0" },
    header: { background: "#1e3a8a", color: "white", padding: "18px", fontWeight: "bold", textAlign: "center" },
    msgArea: { flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "#f1f5f9" },
    botMsg: (isLink) => ({ 
      background: isLink ? "#dbeafe" : "white", 
      padding: "12px", borderRadius: "18px 18px 18px 2px", 
      maxWidth: "85%", fontSize: "13px", color: isLink ? "#1e40af" : "#1e293b", 
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
      cursor: isLink ? "pointer" : "default",
      fontWeight: isLink ? "bold" : "normal",
      border: isLink ? "1px solid #bfdbfe" : "none"
    }),
    userMsg: { background: "#2563eb", color: "white", padding: "12px", borderRadius: "18px 18px 2px 18px", alignSelf: "flex-end", maxWidth: "85%", fontSize: "13px" },
    inputArea: { display: "flex", padding: "12px", background: "white", borderTop: "1px solid #e2e8f0", alignItems: "center", gap: "10px" }
  };

  return (
    <>
      <div style={styles.launcher} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "🤖"}
      </div>

      <div style={styles.chatWindow}>
        <div style={styles.header}>GovAssistant AI 🏛️</div>
        
        <div style={styles.msgArea}>
          {messages.map((m, i) => (
            <div 
              key={i} 
              style={m.sender === "bot" ? styles.botMsg(m.isLink) : styles.userMsg}
              onClick={() => m.isLink && navigate(`/schemes/${m.linkId}`)}
            >
              {m.text}
            </div>
          ))}
          {isTyping && <div style={{fontSize: '11px', color: '#64748b'}}>Searching Database...</div>}
          <div ref={msgEndRef} />
        </div>

        <div style={styles.inputArea}>
          <button onClick={startVoiceRecognition} style={{background: 'none', border: 'none', cursor: 'pointer'}}>🎙️</button>
          <input 
            style={{ flex: 1, border: "none", outline: "none" }}
            placeholder="Search schemes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "bold", cursor: "pointer" }}>Send</button>
        </div>
      </div>
    </>
  );
}

export default Chatbox;