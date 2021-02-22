import {START_RECOG, STOP_RECOG, RECOG_STATE, GET_STREAM_INFO} from "../types/userTypes";
export const backend = process.env.REACT_APP_BACK_END || 'http://localhost:5000';

export const startRecog = () => (dispatch) => {
    dispatch({ type: START_RECOG, payload: {} });
}

export const stopRecog = () => (dispatch) => {
    dispatch({ type: STOP_RECOG, payload: {} });
}
export const recogState = (bool) => (dispatch) => {
    dispatch({ type: RECOG_STATE, payload: bool });
}
export const setStreaming = (bool) => (dispatch) => {
    dispatch({ type: GET_STREAM_INFO, payload: bool });
}
export const alertMail = async(command) => {
    console.log(command)
    // try {
    //     await fetch(`${backend}/api/sendAlertMail`, {

    //         headers: {

    //             'Content-Type': 'application/json',
    //             // 'authorization': 'Bearer ' + token
    //         },

    //         method: "POST",

    //         body:
    //             JSON.stringify({ command })

    //     });
    // }
    // catch (error) {
    //     console.log(error);
    // }

}
//remove video by id //TODO: make more robust, fix backend
