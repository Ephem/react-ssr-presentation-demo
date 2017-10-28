const ACTION_TYPES = {
    SET_EXPANDABLE: 'SET_EXPANDABLE'
};

const initialState = {
    "1": false,
    "2": false
};

export default function expandablesReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_EXPANDABLE:
            return {
                ...state,
                [action.payload.name]: action.payload.isOpen
            };
        default:
            return state;
    }
}

export const selectIsOpen = (state, props) => ({
    isOpen: state.expandables[props.name]
});

export const setExpandableAction = ({ name, isOpen }) => ({
    type: ACTION_TYPES.SET_EXPANDABLE,
    payload: {
        name,
        isOpen
    }
});
