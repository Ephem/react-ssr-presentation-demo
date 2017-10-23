import React from 'react';
import { NavLink, Route } from 'react-router-dom';

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

class ExpandableSection extends React.Component {
    state = { isOpen: false }
    render() {
        return (
            <div className={css.expandableSection}>
                <button
                    className={css.expandableSectionHeader}
                    onClick={() => this.setState({ isOpen: !this.state.isOpen })}>
                    Click this header to {this.state.isOpen ? 'close' : 'open'}
                </button>
                <div className={this.state.isOpen ? css.expandableSectionBodyOpen : css.expandableSectionBodyClosed}>
                    {this.state.isOpen && this.props.children}
                </div>
            </div>
        );
    }
}

class CatsPage extends React.Component {
    state = { cat: null }
    componentDidMount() {
        if (this.state.cat === null) {
            this.getNewCat();
        }
    }
    getNewCat(category) {
        fetch(`https://thecatapi.com/api/images/get?format=html&type=gif${category ? `&category=${category}` : ''}`)
            .then((res) => res.text())
            .then((text) => {
                this.setState({
                    cat: text
                });
            });
    }
    render() {
        if (!this.state.cat) {
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
                    dangerouslySetInnerHTML={{ __html: this.state.cat }} />
            </div>
        );
    }
};

const ExpandableSectionsPage = () => ([
    <ExpandableSection key="1">
        First section is expanded!
    </ExpandableSection>,
    <ExpandableSection key="2">
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
