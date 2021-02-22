import { START_RECOG, STOP_RECOG, RECOG_STATE } from "../types/userTypes";


const initialState = {
    isRecog: false,
    recogState: false,
    timeout: 10

};

const userReducer = (state = initialState, action) => {

    switch (action.type) {
        
        case START_RECOG:
            return {
                ...state,
                isRecog: true
            }
        case STOP_RECOG:
            return {
                ...state,
                isRecog: false
            }
        case RECOG_STATE:
            return {
                ...state,
                recogState: action.payload
            }
        default:
            return state;
    }
};

export default userReducer;
