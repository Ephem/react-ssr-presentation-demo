import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { selectIsOpen, setExpandableAction } from './expandablesModule';
import { selectForCatsPage, getCatAction } from './catsModule';
import Spinner from './Spinner';
import normalize from './normalize.css';
import css from './app.css';

const Nav = () => (
    <div>
        <div className={css.nav}>
            <div className={css.navHeader}>SSR Demo (SSR)</div>
        </div>
        <div className={css.subNav}>
            <NavLink
                exact
                activeClassName={css.subNavLinkActive}
                className={css.subNavLink}
                to="/">Start</NavLink>
            <NavLink
                activeClassName={css.subNavLinkActive}
                className={css.subNavLink}
                to="/cats">Cats</NavLink>
        </div>
    </div>
);

class ExpandableSectionDumb extends React.Component {
    render() {
        return (
            <div className={css.expandableSection}>
                <button
                    className={css.expandableSectionHeader}
                    onClick={() => this.props.dispatch(setExpandableAction({
                        name: this.props.name,
                        isOpen: !this.props.isOpen
                    }))}
                >
                    Click this header to {this.props.isOpen ? 'close' : 'open'}
                </button>
                <div className={this.props.isOpen ? css.expandableSectionBodyOpen : css.expandableSectionBodyClosed}>
                    {this.props.isOpen && this.props.children}
                </div>
            </div>
        );
    }
}

const ExpandableSection = connect(selectIsOpen)(ExpandableSectionDumb);

class CatsPageDumb extends React.Component {
    componentDidMount() {
        if (this.props.cat === null) {
            this.getNewCat();
        }
    }
    getNewCat(category) {
        this.props.dispatch(getCatAction(category));
    }
    render() {
        if (!this.props.cat) {
            return <Spinner />;
        }

        return (
            <div>
                <div className={css.catButtonContainer}>
                    <button
                        className={css.catButton}
                        onClick={() => this.getNewCat()}>Random cat</button>
                    <button
                        className={css.catButton}
                        onClick={() => this.getNewCat('hats')}>Cat with hat</button>
                    <button
                        className={css.catButton}
                        onClick={() => this.getNewCat('space')}>Cat in space</button>
                </div>
                <div
                    className={css.catContainer}
                    dangerouslySetInnerHTML={{ __html: this.props.cat }} />
            </div>
        );
    }
};

const CatsPage = connect(selectForCatsPage)(CatsPageDumb);

const ExpandableSectionsPage = () => ([
    <ExpandableSection key="1" name="1">
        First section is expanded!
    </ExpandableSection>,
    <ExpandableSection key="2" name="2">
        Second section is expanded!
    </ExpandableSection>
]);

const Main = () => (
    <div className={css.mainContainer}>
        <Route exact path="/" component={ExpandableSectionsPage} />
        <Route path="/cats" component={CatsPage} />
    </div>
);

export default () => (
    <div className={css.container}>
        <Nav />
        <Main />
    </div>
);
