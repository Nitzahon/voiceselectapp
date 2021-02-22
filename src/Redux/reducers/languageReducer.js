import { CHANGE_LANGUAGE } from "../types/languageTypes";


const initialState = {
    language: 'english'
};

const languageReducer = (state = initialState, action) => {

    switch (action.type) {
        case CHANGE_LANGUAGE:
            return {
                language: action.payload
            }
        default:
            return state;
    }
};

export default languageReducer;
