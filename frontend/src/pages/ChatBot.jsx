import { useEffect, useRef, useState } from "react";
import "../Chatbot.css";
import ChatbotIcon from "../components/ChatbotIcon";
import ChatForm from "../components/ChatForm";
import ChatMessage from "../components/ChatMessage";
import { companyInfo } from "../companyInfo";
const Chatbot=({setChatbotOpen})=>{
    const [chatHistory, setChatHostory]=useState([{
        hideInChat:true,
        role:"model",
        text:companyInfo
    }]);
    const chatBodyRef=useRef();
    const genarateBotResponse = async (history) => {
        const updateHistory =(text,isError=false)=>{
            setChatHostory(prev=>[...prev.filter(msg=>msg.text !=="Thinking....."),{role:"model",text,isError}])
        }
        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history }),
        };
        try {
            const response = await fetch(import.meta.env.VITE_CHATBOTAPI_URL, requestOptions); //Corrected to VITE_
            if (!response.ok) {
                const errorText = await response.text(); // Get the error text
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const data = await response.json();
            const apiResponseText=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
            updateHistory(apiResponseText);
        } catch (error) {
            updateHistory(error.message,true);
        }
    };
    useEffect(()=>{
        chatBodyRef.current.scrollTo({top:chatBodyRef.current.scrollHeight, behavior:"smooth"});
    },[chatHistory]);
    return(
        <div className="container">
            <div className="chatbot-popup">
                {/* Chatbot header */}
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon/>
                        <h2 className="logo-text">
                        UniLink Bot
                        </h2>
                    </div>
                    <button className="material-symbols-rounded"  onClick={() => setChatbotOpen(false)}>keyboard_arrow_down</button>
                </div>
                {/* Chatbot Body */}
                <div ref={chatBodyRef} className="chat-body">
                    <div className="message bot-message">
                    <ChatbotIcon/>
                        <p className="message-text">
                        👋 Hey there!<br/> How can I assist you today? 😊💡
                        </p>
                    </div>
                    {chatHistory.map((chat,index)=>(
                        <ChatMessage key={index} chat={chat}/>
                    ))}
                </div>
                {/* Chatbot Footer */}
                <div className="chat-footer">
                   <ChatForm chatHistory={chatHistory} setChatHostory={setChatHostory} genarateBotResponse={genarateBotResponse}/>
                </div>
            </div>
        </div>
    )
}
export default Chatbot;