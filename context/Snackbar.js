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

 const handleSnackbar = ({error,messege,usernameerror,emailerror,emailmessege,matchotperror,matchotpmessege}) => {
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
    }

       // error in username  verfication 
    else if(usernameerror){
    
       setShow(true);
      setMessege(usernameerror[0]);
      setExplain(usernameerror[1]);
      setType('error');
    
        try {
        SoundPlayer.playSoundFile('error', 'mp3');
      } catch (e) {
        console.log('Cannot play beep sound', e);
      }


    }




    else if(emailmessege){
      setShow(true);
      setMessege(emailmessege[0]);
      setExplain(emailmessege[1]);
      setType('success');

      try {
        SoundPlayer.playSoundFile('ding2', 'mp3');
      } catch (e) {
        console.log('Cannot play ding2 sound', e);
      }
    
      
    }


    // error in email verfication 

      else if(emailerror){


         setShow(true);
      setMessege(emailerror[0]);
      setExplain(emailerror[1]);
      setType('error');


         try {
        SoundPlayer.playSoundFile('error', 'mp3');
      } catch (e) {
        console.log('Cannot play beep sound', e);
      }


      }
    
    
    else if (messege) {
      setShow(true);
      setMessege(messege[0]);
      setExplain(messege[1]);
      setType('success');
     
      try {
        SoundPlayer.playSoundFile('ding2', 'mp3');
      } catch (e) {
        console.log('Cannot play ding2 sound', e);
      }
    





    } 
    else if(matchotperror){

   setShow(true);
      setMessege(matchotperror[0]);
      setExplain(matchotperror[1]);
      setType('error');


         try {
        SoundPlayer.playSoundFile('error', 'mp3');
      } catch (e) {
        console.log('Cannot play beep sound', e);
      }

    }

    else if(matchotpmessege){
       setShow(true);
      setMessege(matchotpmessege[0]);
      setExplain(matchotpmessege[1]);
      setType('success');
     
      try {
        SoundPlayer.playSoundFile('ding2', 'mp3');
      } catch (e) {
        console.log('Cannot play ding2 sound', e);
      }


    }
    
    else {
    
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
