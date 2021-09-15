import React from 'react';

const Footer = (props:any) => {
    const {shortState}= props;
    return (
        <div className={"main-footer " + (shortState ? 'shortStateClass' : 'longStateClass')}>
            <div className="pull-right hidden-xs"></div>
    Copyright © 2020 beebl.io | All rights reserved.</div>
    );
};

export default Footer;