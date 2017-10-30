import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import Uri from 'jsuri';

function addQueryParamFromAction(uriObj, action) {
    if (!action.metadata ||
        typeof action.metadata.queryKey !== 'string' ||
        typeof action.metadata.queryValue !== 'string') {
        return;
    }
    const queryKey = action.metadata.queryKey;
    const queryValue = action.metadata.queryValue;

    if (uriObj.hasQueryParam(queryKey)) {
        uriObj.deleteQueryParam(queryKey);
    }

    uriObj.addQueryParam(queryKey, queryValue);
}

function getUrl(loc, action, anchor) {
    let url;
    if (typeof loc === 'string') {
        url = loc;
    } else {
        url = loc.pathname;
        if (loc.search) {
            url += loc.search;
        }
        if (loc.hash) {
            url += loc.hash;
        }
    }
    const uriObj = new Uri(url);
    if (anchor) {
        uriObj.setAnchor(anchor);
    }

    if (action) {
        addQueryParamFromAction(uriObj, action);
    }

    return uriObj.toString();
}

export class Link extends Component {
    handleClick = (evt) => {
        if (this.props.action) {
            this.props.dispatch(this.props.action);
        }

        if (!this.props.to) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
    handleKeyPress = (evt) => {
        if (evt.key === ' ' || evt.key === 'Enter') {
            this.handleClick(evt);
        }
    }
    render() {
        if (!this.props.location) {
            return null;
        }
        const {
            location,
            staticContext,
            dispatch,
            history,
            match,
            action,
            anchor,
            ...rest
        } = this.props;
        let linkProps = { ...rest };
        linkProps.onClick = this.handleClick;
        linkProps.to = getUrl(this.props.to || location, action, anchor);

        // If this link does not lead to a new page,
        // make sure it looks and behaves like a button by:
        // - Having role=button
        // - Responding to both space and enter key-events
        if (!this.props.to) {
            linkProps.role = 'button';
            linkProps.onKeyPress = this.handleKeyPress;
        }

        return (
            <RouterLink {...linkProps} />
        );
    }
}

export default connect()(withRouter(Link));
