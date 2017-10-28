import React from 'react';
import { StaticRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';

export default ({ req, ctx, store }) => {
    return (
        <Provider store={store}>
            <Router context={ctx} location={req.url}>
                <App />
            </Router>
        </Provider>
    );
};
