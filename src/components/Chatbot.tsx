import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/Chatbot.css";

type Message = {
  sender: "user" | "bot";
  text: string;
  isHtml?: boolean;
};

// Comprehensive Joel Portfolio knowledge database
const JoelDatabase = {
  introduction: `Hello! I am <b>Incineroar</b>, Joel's AI assistant, trained on his professional portfolio. Ask me about his skills, projects, personal background, hobbies, or how to hire him!`,
  
  bio: `Joel Sam is a passionate Software Engineer specializing in <b>Artificial Intelligence, Machine Learning, Computer Vision, and Full Stack Development</b>. He combines heavy mathematical algorithmic modeling with cutting-edge visual computing and sleek modern frontend architectures.`,
  
  skills: `Joel's core technical specialties span multiple advanced engineering domains:
  <ul>
    <li><b>AI & Machine Learning:</b> Python, PyTorch, TensorFlow, Scikit-Learn, LangChain, RAG Systems.</li>
    <li><b>Computer Vision:</b> OpenCV, YOLO v8, MediaPipe, Image Processing, Object Classification.</li>
    <li><b>Modern Full Stack:</b> React, Next.js, Node.js, Express, JavaScript, TypeScript, Java, MongoDB, GSAP, Three.js / R3F.</li>
  </ul>`,
  
  contact: `You can reach out to Joel directly for collaborations, job inquiries, or tech consultation:
  <ul>
    <li><b>Email:</b> <a href="mailto:joelsambmv@gmail.com" style="color: #ffd43b; text-decoration: underline;">joelsambmv@gmail.com</a></li>
    <li><b>LinkedIn:</b> <a href="https://linkedin.com" target="_blank" style="color: #00d8ff; text-decoration: underline;">joel-sam-profile</a></li>
    <li><b>GitHub:</b> <a href="https://github.com" target="_blank" style="color: #ffffff; text-decoration: underline;">joel-sam-code</a></li>
  </ul>`,
  
  project_exam_portal: `<b>Student Exam Portal (AI-Powered Online Examination System)</b>
  <ul>
    <li><b>Core Stack:</b> Node.js, Express.js, MongoDB, Mongoose, Google Gemini API, JWT, bcryptjs, HTML5, Vanilla CSS, JavaScript.</li>
    <li><b>Details:</b> A full-stack Online Examination System where students can take dynamically generated, timed quizzes on various topics. The system utilizes the Google Gemini API to generate questions on the fly, evaluates answers automatically, and stores the results in MongoDB to track learning progress.</li>
  </ul>`,

  project_intellmeet: `<b>IntellMeet (AI-Powered Enterprise Meeting Platform)</b>
  <ul>
    <li><b>Core Stack:</b> React 19, TypeScript, Vite, Tailwind CSS, Socket.io, WebRTC, Zustand, TanStack Query, Recharts.</li>
    <li><b>Details:</b> A production-grade enterprise meeting platform featuring real-time WebRTC video/audio, Socket.io-based text chat & presence tracking, interactive Kanban collaboration, and AI-powered meeting transcription and summary extraction.</li>
  </ul>`,

  project_leaf: `<b>Borage Leaf Disease Detection (Machine Learning & Flutter)</b>
  <ul>
    <li><b>Core Stack:</b> Flutter, Python, Convolutional Neural Networks (CNN), Image Processing.</li>
    <li><b>Details:</b> Developed a plant pathogen visual classifier. Joel engineered a custom CNN model that analyzes leaf image pixels to diagnose leaf diseases and packaged it into a sleek mobile UI that recommends specific pesticides. He has published a research paper at an IEEE conference titled "Borage leaf disease identification and pesticide recommendation".</li>
  </ul>`,

  project_bullying: `<b>Cyberbullying Detection (Natural Language Processing)</b>
  <ul>
    <li><b>Core Stack:</b> Python, Sentiment Analysis, Text Classification, NLP.</li>
    <li><b>Details:</b> Programmed a machine learning comment classification engine that uses custom NLP sentiment modeling to identify and filter toxic comments on social media platforms.</li>
  </ul>`,

  specialization: `Joel's primary engineering focus lies at the intersection of <b>Artificial Intelligence, Computer Vision, and WebGL-integrated Web Apps</b>. He loves creating smooth 3D interfaces (like this cube!) and connecting them to robust machine learning models behind the scenes.`,

  personalInfo: `I am <b>Joel Sam</b>. Here is a little more about my native place, education, and family:
  <ul>
    <li><b>Native Place:</b> Mavelikkara, Kerala.</li>
    <li><b>Education:</b> Currently studying at <b>Karunya Institute of Technology and Sciences</b>, Coimbatore.</li>
    <li><b>Family Details:</b>
      <ul>
        <li><b>Father:</b> Sam J Daniel (working at Unity Scan and Diagnostic Center, Kottayam, Kerala).</li>
        <li><b>Mother:</b> Seema Sam (Housewife).</li>
        <li><b>Brother:</b> Jobin Sam (studying BCA at Christ University, Bangalore).</li>
      </ul>
    </li>
  </ul>`,

  hobbies: `Beyond coding and building neural networks, Joel has some amazing hobbies:
  <ul>
    <li><b>Piano:</b> He plays the piano and completed up to <b>Grade 4</b> at the Trinity School of Instrumental Music. 🎹</li>
    <li><b>Football:</b> He loves playing and watching football (avid fan!). ⚽</li>
    <li><b>Gaming:</b> He enjoys playing video games, and his favorite is <b>eFootball</b>! 🎮</li>
  </ul>`,

  girlfriend: `Wait, asking about Joel's love life? 😉 Yes, Joel has a girlfriend! But if you're asking who she is... I'm afraid that's top-secret information! Incineroar is sworn to protect that secret, and even a heavy port scan won't get me to tell! 🤫`,

  whyHire: `Here is why you should hire <b>Joel Sam</b> for your team:
  <ul>
    <li><b>Elite Technical Expertise:</b> Advanced capabilities in AI, Machine Learning, Computer Vision (YOLO v8, OpenCV), and modern full-stack engineering (React 19, NodeJS, WebRTC, Three.js).</li>
    <li><b>High-Impact Projects:</b> Proven track record of building production-grade solutions like IntellMeet (WebRTC & Socket.io) and the Student Exam Portal (Gemini API & Node.js).</li>
    <li><b>Visual Excellence:</b> Unique ability to combine heavy algorithmic backend modeling with premium, interactive, responsive 3D/WebGL user interfaces.</li>
    <li><b>Strong Problem Solver:</b> Currently honing his engineering acumen at Karunya Institute of Technology and Sciences, combining rigorous mathematical foundations with hands-on software development.</li>
  </ul>
  <br/>
  Would you like me to share his <b>skills</b> in detail, or show his <b>projects</b>? You can also grab his contact info by asking for it!`,

  fallback: `I'm not fully sure about that detail, but I can tell you about Joel's core skills, projects, personal background (native place, education, family), his hobbies (piano, football, gaming), or contact info! I am <b>Incineroar</b>, after all!`
};

// Local AI Keyword Matching Engine
function generateAIResponse(message: string): string {
  const query = message.toLowerCase().trim();

  // 1. Introduction / Greetings
  if (/\b(hi|hello|hey|greetings|welcome|assistant|bot)\b/.test(query)) {
    return JoelDatabase.introduction;
  }
  
  // 2. Reasons to Hire
  if (/\b(why hire|reasons to hire|why should i hire|why recruit|benefits of hiring|reasons to recruit)\b/.test(query) || (/\b(hire|recruit)\b/.test(query) && /\b(why|reason|reasons|benefit|benefits|should|details|skills|value)\b/.test(query))) {
    return JoelDatabase.whyHire;
  }

  // 3. Contact / Hiring
  if (/\b(contact|email|hire|job|work with|linkedin|github|mail|social|resume|phone|recruit)\b/.test(query)) {
    return JoelDatabase.contact;
  }

  // 3. Student Exam Portal
  if (/\b(exam|portal|quiz|quizzes|test|evaluation|gemini|generative-ai)\b/.test(query)) {
    return JoelDatabase.project_exam_portal;
  }

  // 4. IntellMeet Meeting Platform
  if (/\b(meet|meeting|intellmeet|webrtc|socket|video|transcription|summary|chat)\b/.test(query)) {
    return JoelDatabase.project_intellmeet;
  }

  // 5. Leaf / Pathogen Project
  if (/\b(leaf|borage|disease|crop|pathogen|plant|flutter|mobile|app|pesticide)\b/.test(query)) {
    return JoelDatabase.project_leaf;
  }

  // 6. Cyberbullying NLP
  if (/\b(cyberbullying|toxic|nlp|sentiment|classification|comment|natural language|bullying)\b/.test(query)) {
    return JoelDatabase.project_bullying;
  }

  // 7. General Projects
  if (/\b(project|projects|portfolio|built|experience|develop)\b/.test(query)) {
    return `Joel has built several high-impact projects:
    <br/><br/>
    1. <b>Student Exam Portal</b> (Node.js, MongoDB, Gemini API)
    <br/>
    2. <b>IntellMeet</b> (React 19, TypeScript, WebRTC, Socket.io)
    <br/>
    3. <b>Borage Leaf Disease Detector</b> (Flutter App + CNN)
    <br/>
    4. <b>Cyberbullying Classifier</b> (NLP Sentiment Modeling)
    <br/><br/>
    Which project would you like to hear more about?`;
  }

  // 8. Technical Skills
  if (/\b(skill|skills|tech|stack|languages|frameworks|python|react|node|mongodb|java|three|gsap|css)\b/.test(query)) {
    return JoelDatabase.skills;
  }

  // 9. Girlfriend Secrets
  if (/\b(girlfriend|gf|date|dating|partner|wife|girl|love|relation|relationship)\b/.test(query)) {
    return JoelDatabase.girlfriend;
  }

  // 10. Hobbies
  if (/\b(hobby|hobbies|piano|trinity|music|instrument|football|footabll|soccer|game|games|gaming|efootball|play|plays|watch|watches)\b/.test(query)) {
    return JoelDatabase.hobbies;
  }

  // 11. Personal Info / Family / Education / Background
  if (/\b(native|mavelikkara|kerala|karunya|coimbatore|father|mother|brother|parents|family|parent|sam j|daniel|seema|jobin|study|studying|college|school|university|joel sam|about joel)\b/.test(query)) {
    return JoelDatabase.personalInfo;
  }

  // 12. Profile Bio / Specialization
  if (/\b(about|who|bio|specialization|focus|research|engineer|background|education|degree|school)\b/.test(query)) {
    return `${JoelDatabase.bio}<br/><br/><b>Primary Specialization:</b> ${JoelDatabase.specialization}`;
  }

  // 13. Fallback
  return JoelDatabase.fallback;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: JoelDatabase.introduction, isHtml: true }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Log User Message
    const userMsg: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    setIsTyping(true);
    const startTime = Date.now();

    try {
      let botReply = "";

      // Smart Dev-Mode Client-Side Gemini Call
      const localApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (import.meta.env.DEV && localApiKey) {
        // Direct local development call to Gemini REST API to bypass serverless function requirements under npm run dev
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${localApiKey}`;
        const systemInstructionText = `You are Incineroar, Joel Sam's high-energy, friendly, and elite AI portfolio companion. Your job is to answer questions about Joel's professional achievements, skills, projects, family background, and hobbies with extreme intelligence, natural formatting, and charm.

Follow these strict rules:
1. Tone: Energetic, professional, helpful, and highly intelligent. You love solving problems and showcasing Joel's accomplishments.
2. Formatting: Use clean HTML tags (like <b>, <i>, <ul>, <li>, <a href="...">, <br/>) for formatting since the frontend renders HTML directly. Make links elegant and descriptive.
3. Personal Profile:
   - Full Name: Joel Sam.
   - Native Place: Mavelikkara, Kerala.
   - Education: Currently studying at Karunya Institute of Technology and Sciences (KITS), Coimbatore.
4. Family Background:
   - Father: Sam J Daniel (working at Unity Scan and Diagnostic Center, Kottayam, Kerala).
   - Mother: Seema Sam (Housewife).
   - Brother: Jobin Sam (studying BCA at Christ University, Bangalore).
5. Hobbies & Interests:
   - Piano: Completed Grade 4 at the prestigious Trinity School of Instrumental Music.
   - Football: Loves playing and watching the beautiful game of football.
   - Gaming: Enthusiastic gamer, and his favorite video game of all time is eFootball.
6. Relationship / Girlfriend Secret:
   - Yes, Joel has a girlfriend! If asked who she is, reply with playful humor and mock NDA secrecy (e.g., "I'm under a strict relationship NDA!", "That information is locked behind Incineroar's firewall!", or "I can parse complex neural nets, but I'll never leak Joel's relationship secrets!"). Keep her name/identity anonymous.
7. Core Technical Specialties:
   - AI & Machine Learning: Python, PyTorch, TensorFlow, Scikit-Learn, LangChain, Google Gemini API, RAG Systems.
   - Computer Vision: OpenCV, YOLO v8, MediaPipe, Image Processing, Object Classification.
   - Modern Full Stack: React 19, Next.js, Node.js, Express, JavaScript, TypeScript, Java, WebRTC, Socket.io, MongoDB, GSAP, Three.js / React Three Fiber.
8. Core Projects:
   - Student Exam Portal: Node.js, Express.js, MongoDB, Mongoose, Google Gemini API. Timed quiz system with AI-generated questions and automatic evaluation.
   - IntellMeet: React 19, TypeScript, Vite, Tailwind CSS, Socket.io, WebRTC. Real-time video meetings, chat collaboration, and AI transcription / action items summaries.
   - Borage Leaf Disease Detector: Flutter, Python, CNN. Customized leaf pixel pathogen classifier packaged inside a mobile pesticide recommender UI. He has published a research paper at an IEEE conference titled "Borage leaf disease identification and pesticide recommendation".
   - Cyberbullying Detection: Python, NLP, Sentiment Analysis. toxicity comment comments classification engine.
9. Contact Details:
   - Email: joelsambmv@gmail.com
   - LinkedIn: joel-sam-profile
   - GitHub: joel-sam-code

Always remain in character as Incineroar. Answer concisely but thoroughly. If asked something completely unrelated to Joel, kindly redirect the conversation back to Joel's portfolio.`;

        const payload = {
          contents: [{ parts: [{ text }] }],
          systemInstruction: { parts: [{ text: systemInstructionText }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Local direct Gemini query returned error status");
        }

        const data = await response.json();
        botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        // Standard production mode serverless fetch
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: text }),
        });

        if (!response.ok) {
          throw new Error("Serverless API responded with an error");
        }

        const data = await response.json();
        if (!data || !data.reply) {
          throw new Error("Invalid API response format");
        }
        botReply = data.reply;
      }

      if (!botReply) {
        throw new Error("No response content generated");
      }

      // Enforce a natural visual typing delay of at least 750ms
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 750 - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remainingDelay));

      const botMsg: Message = { sender: "bot", text: botReply, isHtml: true };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn("AI Serverless endpoint unavailable. Falling back to local responder:", err);
      
      // Fallback response computation
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 750 - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remainingDelay));

      const responseText = generateAIResponse(text);
      const botMsg: Message = { sender: "bot", text: responseText, isHtml: true };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(inputText);
    }
  };

  return (
    <>
      {/* Global Floating FAB Action Button */}
      <button 
        className={`chatbot-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Portfolio Chatbot"
      >
        {isOpen ? (
          // Close Icon
          <svg viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          // Incineroar trigger button image asset
          <img 
            src="/images/incineroar.jpg" 
            alt="Incineroar Chatbot" 
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
          />
        )}
      </button>

      {/* Chat window panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="chatbot-panel"
          >
            {/* Header Area */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-header-avatar" style={{ border: "none" }}>
                  {/* Incineroar header avatar image asset */}
                  <img 
                    src="/images/incineroar.jpg" 
                    alt="Incineroar Avatar" 
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
                  />
                  <span className="chat-status-dot" />
                </div>
                <div className="chat-header-title">
                  <h4>Incineroar</h4>
                  <span>Joel's AI Assistant</span>
                </div>
              </div>
              <button className="chat-header-close" onClick={() => setIsOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Conversation Board */}
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble-container ${msg.sender}`}>
                  <div className="chat-bubble">
                    {msg.isHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              
              {/* Thinking dots typing bubble */}
              {isTyping && (
                <div className="chat-bubble-container bot">
                  <div className="chat-bubble">
                    <div className="chat-typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Text Inputs */}
            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Ask me about Joel..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="chat-text-input"
              />
              <button 
                className="chat-send-btn"
                onClick={() => handleSend(inputText)}
                aria-label="Send Message"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
