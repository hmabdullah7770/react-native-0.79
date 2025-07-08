import {useContext, useState} from 'react';
import {createContext} from 'react';
// import Sound from 'react-native-sound';
import SoundPlayer from "react-native-sound-player";


// const createContext = useContext()

export const SnackbarContext = createContext();

export const SnackProvider = ({children}) => {
  const [show, setShow] = useState(false);
  const [messege, setMessege] = useState('');
  const [explain, setExplain] = useState('');
  const [type, setType] = useState('info');

  const handleSnackbar = ({error, messege}) => {
    if (error) {
      setShow(true);
      setMessege(error[0]);
      setExplain(error[1]);
      setType('error');
      try {
        SoundPlayer.playSoundFile('error', 'mp3');
      } catch (e) {
        console.log('Cannot play beep sound', e);
      }
    } else if (messege) {
      setShow(true);
      setMessege(messege[0]);
      setExplain(messege[1]);
      setType('success');
      try {
        SoundPlayer.playSoundFile('ding2', 'mp3');
      } catch (e) {
        console.log('Cannot play ding2 sound', e);
      }
    } else {
      setShow(false);
    }
  };

  return (
    <SnackbarContext.Provider
      value={{type, show, setShow, messege, explain, handleSnackbar}}>
      {children}
    </SnackbarContext.Provider>
  );
};
