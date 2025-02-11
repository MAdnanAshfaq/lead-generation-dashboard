import React from 'react';

const UFO = ({ position }) => {
    return (
        <div className={`ufo-container ${position}`}>
            <div className="ufo">
                <div className="alien"></div>
                {(position === 'email' || position === 'password') && (
                    <div className="ufo-beam"></div>
                )}
            </div>
        </div>
    );
};

export default UFO; 