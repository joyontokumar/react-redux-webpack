const redux = require('redux');
const createStore = redux.createStore;
const combineReducers = redux.combineReducers;
const middleware = redux.applyMiddleware;
const thunkMiddleware = require('redux-thunk').default;
const axios = require('axios');
const { act } = require('react-dom/test-utils');

// action type define

const initalState = {
    loading: false,
    users: [],
    error: ''
}

const USER_REQUEST = 'USER_REQUEST';
const USER_SUCCESS = 'USER_SUCCESS';
const USER_ERROR = 'USER_ERROR';

const userRequest = () => {
    return {
        type: USER_REQUEST
    }
}

const userSuccess = (users) => {
    return {
        type: USER_SUCCESS,
        payload: users
    }
}

const userError = (error) => {
    return {
        type: USER_ERROR,
        payload: error
    }
}

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload,
                error: ''
            }
        case USER_ERROR:
            return {
                ...state,
                loading: false,
                users: [],
                error: action.payload
            }
    }
}

const fetchUser = () => {
    return function (dispatch) {
        dispatch(userRequest())
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(res => {
                // res.data
                const users = res.data.map(user => {
                    return user.name
                })
                dispatch(userSuccess(users))
            })
            .catch(error => {
                // error.match
                dispatch(userError(error.message))
            })
    }
}

const store = createStore(reducer, middleware(thunkMiddleware));

store.subscribe(() => {
    console.log("Updated state", store.getState())
});
store.dispatch(fetchUser())
