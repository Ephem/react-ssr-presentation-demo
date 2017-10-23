import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

function initReact() {
    function render(Component) {
        ReactDOM.render(
            <Router>
                <Component />
            </Router>,
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
