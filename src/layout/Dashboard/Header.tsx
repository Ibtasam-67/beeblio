import React, { useState, useEffect, useContext } from 'react';
import LogoMini from '../../assets/images/dashboard/sm.png';
import Logo from '../../assets/images/dashboard/logo.png';
import Image1 from '../../assets/images/dashboard/img1.jpg';
import { Link, useHistory } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { authAxios } from '../../api/authApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faCogs, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/auth/AuthContextProvider';

const Header = (props: any) => {
    const { setShortstate, shortState, width } = props;
    const currentUser: any = localStorage.getItem('currentUser');
    const user = JSON.parse(currentUser);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    const history = useHistory();
    const [imageUploadedPath, setImageUploadedPath] = useState(null);
    const authContext = useContext(AuthContext)

    const handleLogOut = () => {
        authContext.clearCurrentUserToken();
        localStorage.clear();
        history.push('/');
    }

    const fetchProfilePicture = async () => {
        const userResult = await authAxios.get(`${process.env.REACT_APP_BASE_URL}/user/image`);
        if (userResult.data.length > 0) {
            setImageUploadedPath((userResult.data)[0].fileLink);
        }
    }

    useEffect(() => {
        fetchProfilePicture();
    }, [])

    return (
        <div className="main-header">
            {width > 767 && <Link to="/" className={"logo blue-bg d-flex justify-content-center align-items-center " + (shortState ? 'shortStateWidthClass' : 'longStateWidthClass')}>
                {shortState && <span><img width="30px" src={LogoMini} alt="logoMini" /></span>}
                {!shortState && <span className="logo-lg"><img src={Logo} alt="logo" height="auto" /></span>}
            </Link>}
            <nav style={{ height: '80px' }} className={"navbar blue-bg navbar-static-top d-flex justify-content-between " + (shortState ? 'shortStateClass' : 'longStateClass')}>
                <ul className="nav navbar-nav pull-left">
                    <li>
                        <a onClick={() => setShortstate()} className=" cursor-pointer"
                            data-toggle="push-menu" style={{ fontSize: '28px' }}>
                            <FontAwesomeIcon icon={faBars} />
                        </a>
                    </li>
                </ul>
                {width <= 767 && <Link to="/" >
                    <img src={Logo} alt="logo" height="auto" width="200px" />
                </Link>}
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <li className="mt-2">
                            <Dropdown isOpen={dropdownOpen} toggle={toggle} >
                                <DropdownToggle className="bg-light text-primary">
                                    <span className="hidden-xs pr-2">Hi {user?.apiUserProfile?.firstName}</span>
                                    <img src={imageUploadedPath ? imageUploadedPath : user?.apiUserProfile?.imageUrl ? user?.apiUserProfile?.imageUrl : Image1} className="user-image" alt="User Image" width="20px" />
                                </DropdownToggle>
                                <DropdownMenu className="user-menu px-3 headerDropDown" >
                                    <div className="d-flex flex-wrap">
                                        <img src={imageUploadedPath ? imageUploadedPath : user?.apiUserProfile?.imageUrl ? user?.apiUserProfile?.imageUrl : Image1} className="img-responsive mr-2" alt="User" width="80px" height="80px" />
                                        <div className="mt-2">
                                            <p className="mb-0" style={{ lineHeight: '1' }}>{user?.apiUserProfile?.firstName}</p>
                                            <p className="text-left mb-0" style={{ textTransform: 'lowercase', fontSize: '12px' }}><small>{user?.email}</small> </p>
                                            <div className="view-link text-left"><Link to="/dashboard/profile">View Profile</Link></div>
                                        </div>
                                    </div>
                                    <DropdownItem className="sideBarLink p-0 mt-2">
                                        <Link to="/dashboard/collection" className="pl-1">
                                            <FontAwesomeIcon className="mr-2" icon={faWallet} /> My Content</Link>
                                    </DropdownItem>
                                    <DropdownItem className="sideBarLink p-0">
                                        <Link to="/dashboard/settings" className="pl-1">
                                            <FontAwesomeIcon className="mr-2" icon={faCogs} />Setting</Link>
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem className="sideBarLink p-0" onClick={() => { handleLogOut() }}>
                                        <a className="pl-1"> <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />Logout</a></DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </li>
                    </ul>
                </div>
            </nav>

        </div>
    );
};

export default Header;