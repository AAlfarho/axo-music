import React from 'react';

const About = () =>(
    <div className="hbox about-me-flex-container">
        <div className="vbox about-me-icons">
            <a  target="_blank" href="https://github.com/AAlfarho/axo-music">
                <i className="fa fa-github-square fa-2x brand-icons-fa"></i>
            </a>
        </div>
        <div className="hbox about-me-icons">
            <a target="_blank" href ="https://www.linkedin.com/in/andrés-alfaro-cortés-b98b1b58/" >
            <i className="fa fa-linkedin-square fa-2x brand-icons-fa"></i>
            </a>
        </div>
    </div>
);
export default About;