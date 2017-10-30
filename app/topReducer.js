import { combineReducers } from 'redux';

import { ACTION_TYPES as CAT_ACTIONS, gotCatAction } from './catsModule';
import expandablesReducer from './expandablesModule';
import catsReducer from './catsModule';

export const asyncMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    switch (action.type) {
        case CAT_ACTIONS.GET_CAT: {
            const category = action.payload.category;

            fetch(`https://thecatapi.com/api/images/get?format=html&type=gif${category ? `&category=${category}` : ''}`)
                .then((res) => res.text())
                .then((text) => {
                    store.dispatch(gotCatAction(text));
                });
        }
    }

    return result;
};

const reducers = {
    expandables: expandablesReducer,
    cats: catsReducer
};

export default combineReducers(reducers);
