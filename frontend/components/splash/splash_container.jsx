import { connect } from 'react-redux';
import {LOGIN_URL, SIGNUP_URL} from '../../util/route_const';
import Splash from './splash';

const mapStateToProps = (state) => ({
  login_url: LOGIN_URL,
  signup_url: SIGNUP_URL
});

export default connect(mapStateToProps)(Splash);
