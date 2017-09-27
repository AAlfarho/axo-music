import React from 'react';

const NoResult = (props) =>(
  <div className="hbox no-result-flex-container">
    <div className="vbox no-result-content-container">
      <h1>No {props.property} results...</h1>
      <i className="fa fa-meh-o fa-5x no-result-sad-smiley" ></i>
    </div>
  </div>

);

export default NoResult;
