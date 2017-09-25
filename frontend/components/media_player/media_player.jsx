import React from 'react';
import ReactPlayer from 'react-player';
import Duration from './duration';
export default class NavBar extends React.Component {
  constructor(props){
    super(props);
    // let url = null;
    // if(props.playback.queue_track_ids)
    this.state = this.setMediaPlayerState(props);
  }

  componentWillReceiveProps(newProps){
    // if( !this.props.playback.collection || !this.state.playing || (
    if( !this.props.playback.collection ||
      (this.state && this.state.queueFinished) || (
      newProps.playback.collection &&
      newProps.playback.collection.id !== this.props.playback.collection.id
        )){
      //Hacky solution to keep track of current playing index
      this.setState({playingIndex: 0}, this.setState(this.setMediaPlayerState(newProps)));

    }
  }

  setMediaPlayerState(props){
    const {songs, playback} = props;
    let url = null;
    let playing = false;
    let playingIndex = 0;
    let queueFinished = false;
    if(this.state && this.state.playingIndex !== undefined && !queueFinished){
      playingIndex = this.state.playingIndex;
    }
    const collectionToPlay = playback.collection;
    if(collectionToPlay){
      const songsToPlay = collectionToPlay.song_ids;
      if(songsToPlay.length > 0) {
        //pop the first song.
        if(songs[songsToPlay[playingIndex]]){
          url = songs[songsToPlay[playingIndex]].file_path;
          playing = true;
          queueFinished = false;
        } else {
            queueFinished = true;
        }
      }
    }

    return {
      url,
      playing,
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      playingIndex,
      queueFinished
    };
  }

  load() {
    return url => {
      this.setState({
        url,
        played: 0,
        loaded: 0
      });
    };
  }

  nextSong() {
    return () => {
      const {songs, playback} = this.props;
      this.setState((prevState) => {
        return {playingIndex: prevState.playingIndex + 1};
      }, () => this.setState(this.setMediaPlayerState(this.props)));
    };
  }

  prevSong() {
    return () => {
      const {songs, playback} = this.props;
      let prevIndex = this.state.playingIndex - 1;
      if(prevIndex >= 0 && (this.state.duration * this.state.played) < 3){
        this.setState((prevState) => {
          return {playingIndex: prevIndex};
        }, () => this.setState(this.setMediaPlayerState(this.props)));
      } else {
        this.player.seekTo(0);
      }

    };
  }
  playPause(){
    return () => {
      this.setState({ playing: !this.state.playing });
    };
  }
  stop(){
    return () => {
      this.setState({ url: null, playing: false });
    };
  }

  setVolume(){
    return e => {
      this.setState({ volume: parseFloat(e.target.value) });
    };
  }
  toggleMuted(){
    return () => {
      this.setState({ muted: !this.state.muted });
    };
  }

  setPlaybackRate(){
    return e => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };
  }
  onPlay(){
    return () => {
      this.setState({ playing: true });
    };
  }
  onPause(){
    return () => {
      this.setState({ playing: false });
    };
  }

  onSeekMouseDown(){
    return e => {
      this.setState({ seeking: true });
    };
  }

  onSeekChange(){
    return e => {
      this.setState({ played: parseFloat(e.target.value) });
    };
  }
  onSeekMouseUp (){
    return e => {
      this.setState({ seeking: false });
      this.player.seekTo(parseFloat(e.target.value));
    };
  }
  onProgress(){
    return state => {
      // We only want to update time slider if we are not currently seeking
      if (!this.state.seeking) {
        this.setState(state);
      }
    };
  }


  ref(){
    return player => {
      this.player = player;
    };
  }

  render () {
    const {
      url, playing, volume, muted,
      played, loaded, duration,
      playbackRate,
    } = this.state;
    const SEPARATOR = ' · ';

    return (
      <div className='media-player-container'>
          <div className='player-wrapper'>
            <ReactPlayer
              ref={this.ref()}
              className='react-player'
              width='100%'
              height='100%'
              url= {url}

              playing={playing}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.onPlay()}
              onPause={this.onPause()}
              onBuffer={() => console.log('onBuffer')}
              onSeek={e => console.log('onSeek', e)}
              onEnded={this.nextSong()}
              onError={e => console.log('onError', e)}
              onProgress={this.onProgress()}
              onDuration={duration => this.setState({ duration })}
            />
          </div>


          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.stop()}>Stop</button>
                <button onClick={this.playPause()}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.nextSong()}>Next</button>
                <button onClick={this.prevSong()}>Prev</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.onSeekMouseDown()}
                  onChange={this.onSeekChange()}
                  onMouseUp={this.onSeekMouseUp()}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume()} />
                <label>
                  <input type='checkbox' checked={muted} onChange={this.toggleMuted()} /> Muted
                </label>
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td><progress max={1} value={played} /></td>
            </tr>
            <tr>
              <th>Loaded</th>
              <td><progress max={1} value={loaded} /></td>
            </tr>
          </tbody></table>

          <h2>State</h2>

          <table><tbody>
            <tr>
              <th>url</th>
              <td className={!url ? 'faded' : ''}>
                {(url instanceof Array ? 'Multiple' : url) || 'null'}
              </td>
            </tr>
            <tr>
              <th>playing</th>
              <td>{playing ? 'true' : 'false'}</td>
            </tr>
            <tr>
              <th>volume</th>
              <td>{volume.toFixed(3)}</td>
            </tr>
            <tr>
              <th>played</th>
              <td>{played.toFixed(3)}</td>
            </tr>
            <tr>
              <th>loaded</th>
              <td>{loaded.toFixed(3)}</td>
            </tr>
            <tr>
              <th>duration</th>
              <td><Duration seconds={duration} /></td>
            </tr>
            <tr>
              <th>elapsed</th>
              <td><Duration seconds={duration * played} /></td>
            </tr>
            <tr>
              <th>remaining</th>
              <td><Duration seconds={duration * (1 - played)} /></td>
            </tr>
          </tbody></table>

      </div>
    );
  }
}
