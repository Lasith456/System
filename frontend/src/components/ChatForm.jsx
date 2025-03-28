import React, { useRef } from 'react'

const ChatForm = ({chatHistory, setChatHostory,genarateBotResponse}) => {
    const inputRef=useRef();
    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const userMessage=inputRef.current.value.trim();
        if(!userMessage)return;
        inputRef.current.value="";
        setChatHostory(history=>[...history,{role:"user", text:userMessage}]);
        setTimeout(()=>{
            setChatHostory((history)=>[...history,{role:"model", text:"Thinking....."}]);
            genarateBotResponse([...chatHistory,{role:"user",text:`Using the details provided above, please address this query: ${userMessage}`}]);
        },600);
    }
  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
        <input type="text" ref={inputRef} placeholder="Type Here.." className="input-message" required />
        <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  )
}

export default ChatForm