import {connect} from 'react-redux';
import MediaPlayer from './media_player';

const mapStateToProps = ({songs, playback})  => ({
  playback,
  songs
});
const mapDispacthToProps = (dispatch) => ({});

export default connect(
  mapStateToProps, mapDispacthToProps
)(MediaPlayer);
