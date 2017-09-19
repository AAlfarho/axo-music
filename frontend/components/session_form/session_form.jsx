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
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder='username' value={username}
            onChange={this.handleChange('username')}/>
          {
            signupFlow &&
            <input type="text" placeholder='Email' value={email}
              onChange={this.handleChange('email')}/>
          }
          <input type='password' value={password} onChange={this.handleChange('password')} />
          <input type="submit" value={submitButtonText}/>
        </form>
        {this.renderErrors()}
      </div>
    );
  }
}

export default withRouter(SessionForm);
