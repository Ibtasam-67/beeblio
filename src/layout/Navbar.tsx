import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import useScrollHandler from '../hooks/ScrollHandler';
import './layout.scss';
import ReactGA from 'react-ga';

import {
    Link,
    useRouteMatch
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faHome, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';

const MainNavbar = () => {
    const scroll = useScrollHandler();
    const authRoutematch = useRouteMatch("/auth");
    const homeRoutematch = useRouteMatch("/");
    const currentUserToken = localStorage.getItem('currentUserToken') && localStorage.getItem('currentUserToken')?.includes('Bearer');
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);


    return (
        <div>
            <header id="site-header" className="header">
                <div id="header-wrap py-0">
                    {/* <div className="container">
                        <div className="row">
                            <div className="col-lg-12"> */}
                    <Navbar expand="lg" style={{ transition: 'background .25s' }} className={"navbar " + (scroll > 20 ? 'bg-white' : '')} fixed='top'>
                        <div className="container nav__con">
                            <NavbarBrand>
                                <Link to="/" className="navbar-brand logo" >
                                    <img id="logo-img" className="logo-img img1"  src={Logo} alt="logo"  style={{width:"200px", marginRight: "auto"}} />
                                </Link>
                            </NavbarBrand>
                            <NavbarToggler onClick={toggle} className="bg-primary mr-1 tog1"/>
                            <Collapse isOpen={isOpen} navbar className="collapse" >
                                <Nav className="mx-auto" navbar>
                                    <ul className="navbar-nav">
                                        <li className="nav-item text-dark"> <a className="nav-link page-scroll" href="#site-header">Home</a></li>

                                        <li className="nav-item text-dark"> 
                                          <ReactGA.OutboundLink to="https://www.beebl.io/about-us/" eventLabel="About us" >
                                            <a className="nav-link page-scroll" >About Beeblio</a>
                                          </ReactGA.OutboundLink>
                                        </li>

                                        <li className="nav-item text-dark"> <a className="nav-link page-scroll" href="#howitworks">How it works</a></li>
                                    </ul>
                                </Nav>
                            </Collapse>
                            <div  >  {homeRoutematch?.isExact && <div className="mx-auto mt-2 mt-sm-0">
                              
                                {currentUserToken &&
                                   <ReactGA.OutboundLink to="/dashboard" eventLabel="dashboard" className="btn btn-white btn-sm topbtn dashboard"  >
                                        <FontAwesomeIcon className="mr-2" icon={faTachometerAlt} 
                            />Dashboard</ReactGA.OutboundLink>}
                                {!currentUserToken && <ReactGA.OutboundLink to="/auth" eventLabel="auth" className="btn btn-white btn-sm topbtn">
                                    <FontAwesomeIcon className="mr-2" icon={faUserPlus} /> Sign up! It's free</ReactGA.OutboundLink>}
                            </div>}
                            {authRoutematch?.isExact && <div className="mx-auto mt-2 mt-sm-0">
                                <ReactGA.OutboundLink to="/" eventLabel="home" className="btn btn-white btn-sm topbtn" style = {{marginRight: "auto"}} >
                                    <FontAwesomeIcon className="mr-2" icon={faHome} /> Home
                                            </ReactGA.OutboundLink>

                            </div>}
                        </div></div>
                          
                    </Navbar>
                </div>
            </header>
        </div >)
};

export default MainNavbar;
