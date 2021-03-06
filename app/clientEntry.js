import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import topReducer, { asyncMiddleware } from './topReducer';
import App from './App';

function initReact() {
    const store = createStore(
        topReducer,
        window.storeData,
        applyMiddleware(asyncMiddleware)
    );

    function render(Component) {
        ReactDOM.hydrate(
            <Provider store={store}>
                <Router>
                    <Component />
                </Router>
            </Provider>,
            document.getElementById('react-app-root')
        );
    }

    render(App);

    if (module.hot) {
        module.hot.accept('./App', () => {
            import('./App').then(() => {
                render(App);
            });
        });
    }
}

if (window.addEventListener) {
    window.addEventListener('load', initReact, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', initReact);
} else {
    window.onload = initReact;
}
