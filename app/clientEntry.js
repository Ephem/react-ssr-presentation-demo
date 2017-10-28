import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import topReducer from './topReducer';
import App from './App';

function initReact() {
    const store = createStore(topReducer);

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
