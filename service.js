import TrackPlayer, { Event } from 'react-native-track-player';

export async function setupPlayerService() {
  TrackPlayer.registerPlaybackService(() => playbackService);
}

async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
}