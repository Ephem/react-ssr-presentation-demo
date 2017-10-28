import path from 'path';
import express from 'express';
import httpProxy from 'http-proxy-middleware';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { createStore } from 'redux';

import webpackStats from '../public/generated/stats.json';

const GeneratedServerApp = require('../public/generated/server');

const isLocal = process.env.NODE_ENV === 'local';

function startServerInstance() {
    const app = express();
    app.set('views', 'server/views');

    app.get('/favicon.ico', function(req, res) {
        return res.status(204);
    });

    if (isLocal) {
        app.use('/public/generated', httpProxy({ target: 'http://localhost:8080/' }));
    }

    app.use('/public', express.static('public'));

    app.use('/', (req, res, next) => {
        let ServerApp = GeneratedServerApp;
        if (isLocal) {
            delete require.cache[require.resolve('../public/generated/server')];
            ServerApp = require('../public/generated/server');
        }

        const store = createStore(ServerApp.topReducer);

        const ctx = {};
        const pageProps = {
            title: 'React SSR Demo (SSR)',
            markup: ReactDOM.renderToString(React.createElement(ServerApp.ServerRoot, { ctx, req, store })),
            assetPaths: {
                applicationCss: webpackStats['application.css'],
                applicationJs: webpackStats['application.js']
            }
        };
        return res.render('ApplicationPage.hbs', pageProps);
    });

    app.listen(3001, () => {
        console.log('Server started on port ' + 3001);
    });
}

startServerInstance();
