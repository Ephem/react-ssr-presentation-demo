const queryKeyMap = {
    'expandable_1': (key, value, req, ServerApp) =>
        ServerApp.actions.setExpandableAction({
            name: '1',
            isOpen: !!Number(value)
        }),
    'expandable_2': (key, value, req, ServerApp) =>
        ServerApp.actions.setExpandableAction({
            name: '2',
            isOpen: !!Number(value)
        })
};

function getActionFromQuery(key, value, req, ServerApp) {
    if (key in queryKeyMap) {
        return queryKeyMap[key](key, value, req, ServerApp);
    }
    return undefined;
}

export default function getActionsFromQuery(req, ServerApp) {
    const queryObject = req.query;
    const actions = [];
    let action;

    for (const key in queryObject) {
        if (!queryObject.hasOwnProperty(key)) {
            continue;
        }
        action = getActionFromQuery(key, queryObject[key], req, ServerApp);
        if (action) {
            actions.push(action);
        }
    }

    return actions;
}
