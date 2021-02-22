import { CHANGE_LANGUAGE } from '../types/languageTypes';


export const changeLanguage = (language) => (dispatch) => {
    try {
        dispatch({ type: CHANGE_LANGUAGE, payload: language })
    }
    catch (error) {
        console.log(error);
    }
};