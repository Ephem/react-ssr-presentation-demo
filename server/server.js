import path from 'path';
import express from 'express';
import httpProxy from 'http-proxy-middleware';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { createStore, applyMiddleware } from 'redux';

import getActionsFromReq from './getActionsFromReq';
import fetch from 'node-fetch';

import webpackStats from '../public/generated/stats.json';
const GeneratedServerApp = require('../public/generated/server');

global.fetch = fetch;

const isLocal = process.env.NODE_ENV === 'local';

function javaScriptSafeStringify(s) {
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Issue_with_plain_JSON.stringify_for_use_as_JavaScript
    return JSON.stringify(s)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

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

        const store = createStore(
            ServerApp.topReducer,
            applyMiddleware(ServerApp.asyncMiddleware)
        );

        const actions = getActionsFromReq(req, ServerApp);
        const promises = actions
            .map(store.dispatch)
            .filter((dispatchResult) => dispatchResult instanceof Promise);

        Promise.all(promises).then(() => {
            const ctx = {};
            const pageProps = {
                title: 'React SSR Demo (SSR)',
                markup: ReactDOM.renderToString(React.createElement(ServerApp.ServerRoot, { ctx, req, store })),
                storeData: javaScriptSafeStringify(store.getState()),
                assetPaths: {
                    applicationCss: webpackStats['application.css'],
                    applicationJs: webpackStats['application.js']
                }
            };
            return res.render('ApplicationPage.hbs', pageProps);
        });
    });

    app.listen(3001, () => {
        console.log('Server started on port ' + 3001);
    });
}

startServerInstance();
