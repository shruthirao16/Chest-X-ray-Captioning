import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        
        <h1 className="home-title">Automated Chest X-ray Captioning</h1>
        
        <p className="home-subtitle">
          An AI-powered tool designed to assist with generating short, 
          clinically meaningful descriptions from chest X-ray images.
        </p>

        <p className="home-smalltext">
          Upload an X-ray, let the model analyze it, and receive a clear, 
          concise caption. 
        </p>

        <div className="home-buttons">
          <Link to="/model">
            <button className="home-btn">Start Captioning</button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;



// import React from 'react';
// import { Link } from 'react-router-dom';
// import './DLModelPage.css';

// const Home = () => {
//   return (
//     <div className="container">
//       <h1>Welcome to Home page</h1>
//       <div className="button-container">
//         <Link to="/dlmodel">
//           <button>Go to DL Model</button>
//         </Link>
//         <br></br>
//         <br></br>
//         <Link to="/llmmodel">
//           <button>LLM</button>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Home;
