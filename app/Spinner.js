/* Adopted from SpinKit | MIT License | github.com/tobiasahlin/SpinKit */

import React from 'react';

import css from './Spinner.css';

export default () => (
    <div className={css.spinner}>
        <div className={css.bounce1}></div>
        <div className={css.bounce2}></div>
        <div className={css.bounce3}></div>
    </div>
);
