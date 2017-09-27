import React from 'react';
import ReactPlayer from 'react-player';
import Duration from './duration';
import ThumbDisplayContainer from '../media_info/thumb_display_container';
export default class MediaPlayer extends React.Component {
  constructor(props){
    super(props);
    // let url = null;
    // if(props.playback.queue_track_ids)
    this.state = this.setMediaPlayerState(props);
  }

  componentWillReceiveProps(newProps){
    // if( !this.props.playback.collection || !this.state.playing || (
    // ||
    //   (this.state && this.state.queueFinished)
    if( !this.props.playback.collection || (!this.state.playing && this.state.queueFinished) || (
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
    let songBeingPlayed;
    if(this.state && this.state.playingIndex !== undefined && !queueFinished){
      playingIndex = this.state.playingIndex;
    }
    const collectionToPlay = playback.collection;
    if(collectionToPlay){
      const songsToPlay = collectionToPlay.song_ids;
      if(songsToPlay.length > 0) {
        //pop the first song.
        if(songs[songsToPlay[playingIndex]]){
          songBeingPlayed = songs[songsToPlay[playingIndex]];
          url = songBeingPlayed.file_path;
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
      queueFinished,
      songBeingPlayed,
      oldVolume: 0.8
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
      const collectionToPlay = playback.collection;
      if(collectionToPlay){
        const songsToPlay = collectionToPlay.song_ids;
        console.log(this.props);
        console.log(this.state);
        console.log(this.state.playingIndex + 1 >= songsToPlay.length);
        if(this.state.playingIndex + 1 >= songsToPlay.length){
          this.setState({
            playing: false,
            queueFinished: true,
            playingIndex: 0,
            played: 0,
            playedSeconds: 0,
            loaded: 0,
            duration: 0,
            url: songs[songsToPlay[0]].file_path});
        } else {
          this.setState({
              playing: true,
              queueFinished: true,
              played: 0,
              playedSeconds: 0,
              loaded: 0,
              duration: 0,
              url: songs[songsToPlay[this.state.playingIndex + 1]].file_path,
              playingIndex: this.state.playingIndex + 1
          });
        }

      }
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
      let volumeVal = 0;
      let oldVolumeVal = 0;
      if(this.state.muted){
        volumeVal = this.state.oldVolume;
      } else {
        oldVolumeVal = this.state.volume;
      }
      this.setState({ muted: !this.state.muted, volume: volumeVal, oldVolume: oldVolumeVal });
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
    let collection = {};
    let song = {};

    let volumeIcon;
    if(muted){
      volumeIcon = <i className="fa fa-volume-off green-elem"></i> ;
    } else if(volume < .5){
      volumeIcon = <i className="fa fa-volume-down"></i> ;
    } else {
      volumeIcon = volumeIcon = <i className="fa fa-volume-up"></i> ;
    }


    if(this.props.playback.collection && this.props.songs){
      collection = this.props.playback.collection;
      song = this.props.songs[collection.song_ids[this.state.playingIndex]];
    }

    // console.log("url", url);
    // console.log("playing", playing);
    // console.log("duration", format(duration));
    // console.log("elapsed", format(duration * played));
    // console.log("remaining", format(duration * (1 - played)));
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

          <div className="hbox media-player-flex-container">
            <div className="hbox current-song-display-flex-container">
              <ThumbDisplayContainer collection={collection} song={song}/>
            </div>

            <div className="vbox media-player-control-flex-container">
              <div className="hbox media-player-playback-controls">
                <i onClick={this.prevSong()} className="fa fa-step-backward fa-2x strong" ></i>
                <div onClick={this.playPause()}>
                  {
                    playing ?
                    <i className="fa fa-pause fa-2x strong" ></i>
                    :
                    <i className="fa fa-play fa-2x strong" ></i>
                  }
                </div>
                <i onClick={this.nextSong()} className="fa fa-step-forward fa-2x strong" ></i>
              </div>

              <div className="hbox media-player-progress">
                {format(duration * played)}
                <progress max={1} value={played} />
                {format(duration)}

                {
                  false &&
                  <input
                    type='range' min={0} max={1} step='any'
                    value={played}
                    onMouseDown={this.onSeekMouseDown()}
                    onChange={this.onSeekChange()}
                    onMouseUp={this.onSeekMouseUp()}
                  />
                }

              </div>

            </div>

            <div className="hbox volume-media-flex-container">
              <div className="volume-media-icon" onClick={this.toggleMuted()}>
                {volumeIcon}
              </div>
              <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume()} />
            </div>
          </div>

      </div>
    );
  }
}


function format (seconds) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function pad (string) {
  return ('0' + string).slice(-2);
}
