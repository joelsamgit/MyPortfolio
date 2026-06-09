import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    name: "Student Exam Portal",
    category: "Full-Stack & AI Integration",
    tools: "Node.js, Express.js, MongoDB, Mongoose, Gemini API, JWT, bcryptjs, HTML5, Vanilla CSS, JavaScript",
    description: "A full-stack Online Examination System built with Node.js, MongoDB, and the Google Gemini API. Allows students to register, log in, and take dynamically generated, timed quizzes on various topics with automatic evaluation.",
    image: "/images/exam-portal.png"
  },
  {
    name: "IntellMeet",
    category: "Full-Stack WebRTC & AI",
    tools: "React 19, TypeScript, Vite, Tailwind CSS, WebRTC, Socket.io, Zustand, TanStack Query, Recharts",
    description: "A production-grade full-stack meeting platform built with React 19, TypeScript, and AI intelligence. Features real-time video meetings with WebRTC, instant chat with Socket.io, live presence, and AI-powered meeting summary & transcription extraction.",
    image: "/images/intellmeet.png"
  },
  {
    name: "Borage Leaf Disease Detection",
    category: "Machine Learning & Flutter App",
    tools: "Flutter, Python, Machine Learning, Image Processing",
    description: "Developed a plant disease detection system for borage leaves. Designed a Flutter mobile app that analyzes leaf images to detect diseases and provides pesticide recommendations.",
    image: "/images/borage-disease.png"
  },
  {
    name: "Cyberbullying Detection",
    category: "Natural Language Processing",
    tools: "Python, Sentiment Analysis, Text Classification, NLP",
    description: "Made a Classification System which uses Sentiment Analysis to classify social media comments as Positive or Negative.",
    image: "/images/cyberbullying.png"
  }
];

const Work = () => {
  useGSAP(() => {
    let translateX = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const workContainer = document.querySelector(".work-container");
      if (!workContainer) return;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = workContainer.getBoundingClientRect().width;
      
      let flexMargin = parseInt(window.getComputedStyle(box[0].parentElement!).marginLeft) || -80;
      let flexPaddingRight = parseInt(window.getComputedStyle(box[0].parentElement!).paddingRight) || 120;
      
      translateX = (rect.width * box.length) + flexPaddingRight + flexMargin - parentWidth;
      
      console.log("DEBUG Work: rect.width =", rect.width, "box.length =", box.length, "flexPaddingRight =", flexPaddingRight, "flexMargin =", flexMargin, "parentWidth =", parentWidth, "translateX =", translateX);

      if (translateX < 0 || isNaN(translateX)) {
        translateX = 0;
      }
    }

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => {
          setTranslateX();
          return `+=${translateX}`;
        },
        scrub: true,
        pin: true,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    console.log("DEBUG Work: ScrollTrigger id 'work' created. start =", timeline.scrollTrigger?.start, "end =", timeline.scrollTrigger?.end);

    timeline.to(".work-flex", {
      x: () => {
        setTranslateX();
        return -translateX;
      },
      ease: "none",
    });

    // Clean up (optional, good practice)
    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <p style={{ opacity: 0.8, fontSize: "14px", lineHeight: "1.4", margin: "10px 0" }}>
                  {project.description}
                </p>
                <h4>Tools used</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage image={project.image} alt={project.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
