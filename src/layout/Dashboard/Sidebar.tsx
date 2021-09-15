import React, { useContext } from 'react';
import {
    Link,
    useRouteMatch,
    useLocation,
    useHistory
} from "react-router-dom";
import { faHome, faUser, faCube, faSearch, faCogs, faPowerOff, faArchive } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../../context/auth/AuthContextProvider';
import { Event, SetDimension, InitAndPageViewGA } from "../../components/Tracking";
import ReactGA from 'react-ga';

const Sidebar = (props: any) => {
    const { shortState } = props;
    const match = useRouteMatch();
    const { pathname } = useLocation();
    const history = useHistory();
    const authContext = useContext(AuthContext)

    const handleLogOut = () => {
        Event('Dashboard', 'Log Out', 'Login Out from the web app ');
        authContext.clearCurrentUserToken();
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className={'main-sidebar ' + (shortState ? 'shortStateWidthClass' : 'longStateWidthClass')}>
            {/* <div className="back"></div> */}
            <div className="sidebar">
                <ul className="sidebar-menu" data-widget="tree">
                    <li className={pathname === `${match.url}` ? 'active ' : ''}>
                        <ReactGA.OutboundLink to={`/dashboard`} eventLabel="Dashboard" >
                            {/* <i className="mr-3 fa fa-home"></i> */}
                            <FontAwesomeIcon icon={faHome} className="mr-3" />
                            {!shortState && <span>Dashboard</span>} <span className="pull-right-container"></span>
                        </ReactGA.OutboundLink>
                    </li>
                    <li className={pathname === `${match.url}/profile` ? 'active ' : ''}>
                        <ReactGA.OutboundLink to={`${match.url}/profile`} eventLabel="Profile" >

                            {/* <i className="mr-3 fa fa-user"></i> */}
                            <FontAwesomeIcon icon={faUser} className="mr-3" />
                            {!shortState && <span> Profile</span>}
                            <span className="pull-right-container"> </span>
                        </ReactGA.OutboundLink>
                    </li>
                    <li className={pathname === `${match.url}/collection` ? 'active ' : ''}>
                        <ReactGA.OutboundLink to={`${match.url}/collection`} eventLabel="Collection" >

                            {/* <i className="mr-3 fa fa-cube"></i> */}
                            <FontAwesomeIcon icon={faCube} className="mr-3" />
                            {!shortState && <span> Content</span>}
                            <span className="pull-right-container"> </span>
                        </ReactGA.OutboundLink></li>
                    <li className={pathname === `${match.url}/search` ? 'active ' : ''}>
                        <ReactGA.OutboundLink to={`${match.url}/search`} eventLabel="Search"  >

                            {/* <i className="mr-3 fa fa-search"></i> */}
                            <FontAwesomeIcon icon={faSearch} className="mr-3" />
                            {!shortState && <span>Searches</span>}
                            <span className="pull-right-container"> </span>
                        </ReactGA.OutboundLink>
                    </li>
                    <li className={pathname === `${match.url}/saved` ? 'active ' : ''}>
                        <ReactGA.OutboundLink to={`${match.url}/saved`} eventLabel="Saved"  >

                            <FontAwesomeIcon icon={faArchive} className="mr-3" />
                            {!shortState && <span>Saved Resources</span>}
                            <span className="pull-right-container"> </span>
                        </ReactGA.OutboundLink>
                    </li>
                    <li className={pathname === `${match.url}/flashcard` ? 'active ' : ''}>
                        <ReactGA.OutboundLink to={`${match.url}/flashcard`} eventLabel="flashcard"  >

                            <FontAwesomeIcon icon={faArchive} className="mr-3" />
                            {!shortState && <span>Flashcard</span>}
                            <span className="pull-right-container"> </span>
                        </ReactGA.OutboundLink>
                    </li>
                    <li className={pathname === `${match.url}/settings` ? 'active ' : ''}>
                        <ReactGA.OutboundLink to={`${match.url}/settings`} eventLabel="Settings" >

                            <FontAwesomeIcon icon={faCogs} className="mr-3" />
                            {!shortState && <span>Settings</span>}
                            <span className="pull-right-container"> </span>
                        </ReactGA.OutboundLink>
                    </li>
                    <li>
                        <a className="cursor-pointer" onClick={handleLogOut}>
                            {/* <i className="mr-3 fa fa-power-off"></i> */}
                            <FontAwesomeIcon icon={faPowerOff} className="mr-3" />
                            {!shortState && <span>Logout</span>} <span className="pull-right-container"></span>
                        </a>
                    </li>
                </ul>
            </div>

        </div>
    );
};

export default Sidebar;