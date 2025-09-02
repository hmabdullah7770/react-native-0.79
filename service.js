// import TrackPlayer, { Event } from 'react-native-track-player';




// export async function setupPlayer() {
//    let isSetup = false;
//   try{
  
//   await TrackPlayer.getCurrentTrack();
//   isSetup = true;
// }
// catch(e){

//    await  TrackPlayer.setupPlayer();
//     isSetup = true;
    
// }

// finally{
//      return isSetup;
// }
   
// }




// // The playback service - must be a default export function
// export default async function PlaybackService() {
//   TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
//   TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
//   TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
//   TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
//   TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
//   TrackPlayer.addEventListener(Event.RemoteSeek, (event) => TrackPlayer.seekTo(event.position));
//   TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
//     if (event.paused) {
//       await TrackPlayer.pause();
//     } else {
//       await TrackPlayer.play();
//     }
//   });
// }



