import React from 'react';
import { withRouter } from 'react-router-dom';
class SessionForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      email: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps){
    //if the new props include the user logged in, redirect to root
    if(newProps.loggedIn){
      this.props.history.push("/");
    }
  }

  handleSubmit(event){
    event.preventDefault();
    const user = this.state;
    this.props.formAction(user);
  }

  handleChange(field){
    return e => this.setState({[field]: e.target.value});
  }

  renderErrors() {
    return(
      <ul>
        {this.props.errors.map((error, i) => (
          <li key={`error-${i}`}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  render(){
    const {username, password, email} = this.state;
    const signupFlow = this.props.formType !== 'login';
    const submitButtonText = signupFlow ? 'Sign up' : 'Login';
    return(
      <div className="splash">
        <div className="hero-image">
          <div className="session-form-wrapper">
            <div className="display-options">
              <div className="left-most-options">
                <div className="extra-small-logo">
                  <img alt="" src="https://open.scdn.co/static/images/logo-white-2x.png"/>
                </div>
                <div className="separator-container">
                  <div className="separator-line"></div>
                  <div className="separator-line"></div>
                </div>
                <div className="session-container">
                  <form className="session-form"onSubmit={this.handleSubmit}>
                    <input type="text" placeholder='Username' value={username}
                      onChange={this.handleChange('username')}/>
                    {
                      signupFlow &&
                      <input type="text" placeholder='Email' value={email}
                        onChange={this.handleChange('email')}/>
                    }
                    <input type='password' value={password} onChange={this.handleChange('password')} placeholder="Password"/>
                    <input className="btn-xl btn-green"type="submit" value={submitButtonText}/>
                    {
                      !signupFlow &&
                      <button className="btn btn-xl btn-white" data-or="or">
                          Demo Login
                        </button>
                    }
                  </form>
                  {this.renderErrors()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SessionForm);
