import { useState } from "react";
import {OpenAI} from 'openai';
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({apiKey: apiKey, dangerouslyAllowBrowser: true});

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e,message) => {
    e.preventDefault();

    setIsTyping(true);

    let msgs = chats;
    msgs.push({role: "user", content: message});
    setChats(msgs);
    scrollTo(0,1e5);
    setMessage("");

    await openai.chat.completions.create({
      model:"gpt-4",
      messages: [
        {
          role: "system",
          content: "You are poet. Like kobi Nazrul Islam."
        },
        ...chats,
      ],

    }).then((result) => {
      msgs.push(result.choices[0].message);
      setChats(msgs);
      setIsTyping(false);
      scrollTo(0,1e5);
    }).catch((err) => console.log(err));
  };

  return (
    <main>
      <h1>OpenAI Chatbot</h1>
      <section>
        {
          chats && chats.length ? (
            chats.map((chat, index) => (
              <p key={index} className={chat.role==="user"?"move_right":""}>
                <span>{chat.role}</span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          ) : ""
        }
      </section>
      <div className={isTyping?"":"hide"}>
        <p>
          <i>Typing</i>
        </p>
      </div>
      

      <form onSubmit={e => chat(e,message)}>
        <input type="text" name="message" value={message} placeholder="Ask here" 
        onChange={e=>setMessage(e.target.value)}/>
      </form>
    </main>
  )
}

export default App;