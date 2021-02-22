import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Select from "react-dropdown-select";
import { useSelector, useDispatch } from "react-redux";
import * as recordingActions from "../Redux/actions/recordingActions";
import hark from "hark";
//import useToggle from "../Hooks/useToggle/useToggle";

export default function WebcamStreamCapture() {
  
  const webcamRef = useRef(null);
  const [error, setError] = useState(false);
  const [audioDevices, setAudioDevices] = useState([]);
  const [audioDeviceId, setAudioDeviceId] = useState({});
  const [tempId, settempId] = useState(null);
  const speechEvents = useRef(null);
  //const streaming = useSelector((state) => state.user.isStreaming);
  const recogState = useSelector((state) => state.user.recogState);
  const dispatch = useDispatch();




  const updateAudioStream = (devId) => {
    if (speechEvents.current !== null) {
      speechEvents.current.stop();
      speechEvents.current = null;
    }
    dispatch(recordingActions.setStreaming(false));
    return setAudioDeviceId(devId);
  };
  const handleDevices = useCallback(
    (mediaDevices) => {
      setAudioDevices(mediaDevices.filter(({ kind }) => kind === "audioinput"));
    },
    [setAudioDevices]
  );

  const resetStream = () => {
    //setup deviceId for attempted restore if deviceId was already updated via setDeviceId
    if (tempId !== null) {
      let index = audioDevices.findIndex((device) => device.deviceId === tempId);
      updateAudioStream(audioDevices[index].deviceId);
    }
    //if this is the first time webcam is running it runs without the deviceId constraint, so force new deviceId constraint
    else {
      updateAudioStream(audioDevices[0].deviceId);
    }
  };

  useEffect(() => {
    if ( audioDevices.length === 0) {
      window.navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }
  }, [audioDevices, handleDevices]);

  const audioConstraints = useRef({
    channelCount: { max: 1 },
    noiseSuppression: true,
    echoCancellation: true,
    sampleRate: { min: 44000 },
  });


  //This will run once the webcamRef gets the user media
  const updateCons = () => {
    dispatch(recordingActions.setStreaming(true));
    // if (webcamRef.current) {
    speechEvents.current = hark(webcamRef.current.stream, {});

    speechEvents.current.on("speaking", function () {
      dispatch(recordingActions.startRecog());
    });

    speechEvents.current.on("stopped_speaking", function () {
      dispatch(recordingActions.stopRecog());
    });
    setError(false);
    // }
  };

  const onUserMediaError = (err) => {
    console.error("error obtaining webcam stream: " + err);
    let temp = audioDeviceId;
    if (JSON.stringify(temp) !== JSON.stringify({})) {
      settempId(temp);
      setAudioDeviceId({});
    }
    switch (err.name) {
      case "OverconstrainedError":
        console.log(err.constraint);
        break;
      default:
        console.log(err);
    }
    dispatch(recordingActions.setStreaming(false));
    setError(true);
  };

  return (
    <React.Fragment>
      {/* ***** Devices options ***** */}
      <div hidden={false}>
      <div className="row">
        <div className="col">
          <Select
            className="deviceSelect"
            options={audioDevices}
            valueField="deviceId"
            onChange={(values) => updateAudioStream(values[0].deviceId)}
          />
        </div>
        <div className="col">
          {/* {streaming ? (
            !error ? (
              count <= bestMime.current.length ? (
                <button
                  style={{ width: "100%", height: "100%" }}
                  onClick={setHiddenVid}
                >
                  {capturing ? "Stop " : "Start "}Capture
                </button>
              ) : null
            ) : null
          ) : null} */}
        </div>
      </div>
      {error ? (
        <div>
          current microphone unaviable, please close down all programs using it and{" "}
          <button onClick={resetStream}>try again</button> or choose a different
          device
        </div>
      ) : null}
      <div className="row justify-content-md-center">
        {recogState ? "Speech Recognition is active and will remain so for 10 seconds or until a command is spoken" : null}
      </div>

      <Webcam
        hidden={true}
        className="videoBox"
        audio={true}
        ref={webcamRef}
        onUserMedia={updateCons}
        onUserMediaError={onUserMediaError}
        audioConstraints={{
          ...audioConstraints.current,
          deviceId: audioDeviceId,
        }}
      />
      </div>
    </React.Fragment>
  );
}
