const pathMap = {
    '/cats': (req, ServerApp) =>
        ServerApp.actions.getCatAction(req.query.category)
};

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

function getActionsFromPath(req, ServerApp) {
    const actions = [];
    let action;

    if (req.path in pathMap) {
        action = pathMap[req.path](req, ServerApp);
        if (action) {
            actions.push(action);
        }
    }

    return actions;
}

function getActionFromQuery(key, value, req, ServerApp) {
    if (key in queryKeyMap) {
        return queryKeyMap[key](key, value, req, ServerApp);
    }
    return undefined;
}

export default function getActionsFromReq(req, ServerApp) {
    const queryObject = req.query;
    const actions = [...getActionsFromPath(req, ServerApp)];
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
