import path from 'path';
import express from 'express';
import httpProxy from 'http-proxy-middleware';

import webpackStats from '../../public/generated/stats.json';

const isLocal = process.env.NODE_ENV === 'local';

function startServerInstance() {
    const app = express();
    app.set('views', 'app/server/views');

    app.get('/favicon.ico', function(req, res) {
        return res.status(204);
    });

    if (isLocal) {
        app.use('/public/generated', httpProxy({ target: 'http://localhost:8080/' }));
    }

    app.use('/public', express.static('public'));

    app.use('/', (req, res, next) => {
        const pageProps = {
            title: 'React SSR Demo (Client)',
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
