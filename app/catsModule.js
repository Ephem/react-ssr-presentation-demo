export const ACTION_TYPES = {
    GET_CAT: 'GET_CAT',
    GOT_CAT: 'GOT_CAT'
};

const initialState = {
    cat: null
};

export default function catsReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.GOT_CAT:
            return {
                cat: action.payload.cat
            };
        default:
            return state;
    }
}

export const selectForCatsPage = (state, props) => ({
    cat: state.cats.cat
});

// This is how you could use redux-thunk for the getCat-action:
/* export const getCatAction = (category) => {
    return (dispatch) => {
        fetch(`https://thecatapi.com/api/images/get?format=html&type=gif${category ? `&category=${category}` : ''}`)
            .then((res) => res.text())
            .then((text) => {
                dispatch(gotCatAction(text));
            });
    };
}; */

export const getCatAction = (category) => ({
    type: ACTION_TYPES.GET_CAT,
    payload: { category }
});

export function gotCatAction(cat) {
    return {
        type: ACTION_TYPES.GOT_CAT,
        payload: {
            cat
        }
    };
}
