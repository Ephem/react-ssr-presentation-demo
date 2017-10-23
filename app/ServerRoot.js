import React from 'react';
import { StaticRouter as Router } from 'react-router-dom';

import App from './App';

export default ({ req, ctx }) => {
    return (
        <Router context={ctx} location={req.url}>
            <App />
        </Router>
    );
};
