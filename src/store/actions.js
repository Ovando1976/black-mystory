// Action Types
export const SET_USER = 'SET_USER';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';
export const SET_SUCCESS = 'SET_SUCCESS';

// Action Creators
export const setUserAction = (user) => ({
    type: SET_USER,
    payload: user
});

export const setErrorAction = (errorMessage) => ({
    type: SET_ERROR,
    payload: errorMessage
});

export const setLoadingAction = (loadingState) => ({
    type: SET_LOADING,
    payload: loadingState
});

export const setSuccessAction = (successState) => ({
    type: SET_SUCCESS,
    payload: successState
});
