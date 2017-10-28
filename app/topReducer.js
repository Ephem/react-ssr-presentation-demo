import { combineReducers } from 'redux';

import expandablesReducer from './expandablesModule';

const reducers = {
    expandables: expandablesReducer
};

export default combineReducers(reducers);
