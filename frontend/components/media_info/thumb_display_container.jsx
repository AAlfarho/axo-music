import { connect } from 'react-redux';
import ThumbDisplay from './thumb_display';

const mapStateToProps = (state, {song, collection}) => ({
  song,
  collection
});


export default connect(mapStateToProps, undefined)(ThumbDisplay);
