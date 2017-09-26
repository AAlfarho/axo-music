import {connect} from 'react-redux';
import {
  reproduceCollection
} from '../../actions/media_player_actions';
import MediaInfoItem from './media_info_item';

const mapStateToProps = (state, {collection}) => {


  return {
    image_url: collection.image_url,
    media_name: collection.name,
    media_author: collection.author_id,
    media_author_name: collection.author_name,
    detail_url: `/user/${collection.author_id}/playlist/${collection.id}`,
    author_url: `/user/${collection.author_id}`
  };

};

const mapDispacthToProps = (dispatch) => {
  return {
    reproduceCollection: (collection) => dispatch(reproduceCollection(collection))
  };
};

export default connect(
  mapStateToProps, mapDispacthToProps
)(MediaInfoItem);
