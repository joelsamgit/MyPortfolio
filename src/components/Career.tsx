import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer Intern</h4>
                <h5>Octanet Solution Pvt Ltd</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Developed a Pet Adoption System using HTML, CSS, and JavaScript, and a fully functional To-Do List application.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Machine Learning Intern</h4>
                <h5>Skillforge</h5>
              </div>
              <h3>04/2025</h3>
            </div>
            <p>
              Developed a Regression Model to predict job salaries and created a classification model to predict the type of cyberbullying on social media.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Generative AI Intern</h4>
                <h5>Young Minds Solution Pvt Ltd</h5>
              </div>
              <h3>06/2025</h3>
            </div>
            <p>
              Developed a Micro-Organism Classification Model and gained hands-on experience in various Machine Learning and Deep Learning models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
