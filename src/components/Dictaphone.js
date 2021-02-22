import React, { useState, useEffect, useCallback, useRef } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { useSelector, useDispatch } from 'react-redux';
import * as recordingActions from '../Redux/actions/recordingActions';
import * as languageActions from '../Redux/actions/languageActions';
import emailjs from 'emailjs-com';

const Dictaphone = ({ sendAns, voiceCommands }) => {
  //Recognized dictLanguage
  const language = useSelector(state => state.language.language)
  const [dictLanguage, setDictLanguage] = useState((language === "english" ? "en-Gb" : "he"));
  //A Check if the speech recognition is currently running
  const { listening } = useSpeechRecognition();
  const isRecog = useSelector(state => state.user.isRecog);
  const duration = useSelector(state => state.user.timeout);
  const timeout= useRef(null)
  const dispatch = useDispatch();
  //A call to start listening
  // const handleStart = () => {
  //   SpeechRecognition.startListening({
  //     language: dictLanguage
  //   });
  // }
  const sendEmail=(message)=>{
    let d = new Date();
    let templateParams = {
      from_name: 'Biomarkerz',
      message: `the command ${message}, was sent on ${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`
  };
    
    emailjs.send('service_440s7ki', 'template_usloata', templateParams, 'user_4abe7mcBKYeomSolLkIKA')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  
  }
  const changeLanguage = useCallback(()=>{
    dispatch(languageActions.changeLanguage((language === "english" ? "hebrew":"english")))
  }, [dispatch, language]);
  //what to run on voice commands
  const videoCommandCallback = (command) => {
    sendAns(command);
    sendEmail(command);
    clearTimeout(timeout.current);
    resetTranscript();
  }
  // const mailAlert = (command) => {
  //   //dispatch(recordingActions.alertMail(command));
  //   console.log(command);
  //   fetch(`${backend}/api/sendAlertMail`, {

  //     headers: {

  //         'Content-Type': 'application/json',
  //         // 'authorization': 'Bearer ' + token
  //     },

  //     method: "POST",

  //     body:
  //         JSON.stringify({ command })

  // });
  //   resetTranscript();
  // }
  //voice commands command can be a string to regonize or an array of strings to recognize
  const commands = [
    // {
    //   command: ['clear', 'נקי'],
    //   callback: ({ resetTranscript }) => resetTranscript(),
    //   matchInterim: true
    // },
    // {
    //   command: [...helpCommands.commands],
    //   callback: (command) => mailAlert(command),
    //   isFuzzyMatch: true,
    //   fuzzyMatchingThreshold: 0.7,
    //   bestMatchOnly: true
    // },
    {
      command: [...voiceCommands],
      callback: (command) => videoCommandCallback(command),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.6,
      bestMatchOnly: true
    }
  ]

  //The actual displayed transcript, won't be needed in final product, must be placed after commands to allow voice command clear
  const { transcript, resetTranscript } = useSpeechRecognition({ commands })
  //handle switching the recognized laguage
  useEffect(() => {
    resetTranscript();
    setDictLanguage((language === "english" ? "en-Gb" : "he"))
  }, [language, resetTranscript])

  useEffect(() => {
    if (isRecog && !listening) {
      SpeechRecognition.startListening({
        language: dictLanguage
      });
      timeout.current = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, duration*1000);
    }
    // else if(!isRecog && listening){
    //   SpeechRecognition.stopListening();
    //   console.log("Stopped")
    // }
  }, [isRecog, listening, dictLanguage, duration])

  useEffect(() => {
    dispatch(recordingActions.recogState(listening));
  }, [listening, dispatch])
  //don't return if speech regonition is not supported
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log("We're sorry, speech rocognition is not available on this browser");
    return null
  }

  return (
    <div>
      <button onClick={changeLanguage}>Current recognized language is {language}</button>
    <div hidden>
      <button onClick={resetTranscript}>Reset</button>
      <div className="row">
        <div className="col-4"></div>
        <div className="trans col-4">
          <span>dictLanguage: {dictLanguage}</span>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <span>{transcript}</span>
            </div>
            <div className="col-2"></div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
    </div>
    </div>
  )
}
export default Dictaphone