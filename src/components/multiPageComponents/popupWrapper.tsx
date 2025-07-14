import React, { useEffect, useState} from 'react';

interface params {
    closeFunc: Function;
    children: React.ReactElement;
};

export default function PopupWrapper({closeFunc, children}:params):React.ReactElement {

    const [popupClasses, setPopupClasses] = useState<string>('popupWrapper');

    //plays the show animation after the popup has loaded
    useEffect(() => {
        setPopupClasses('popupWrapper shown');
    }, []);

    //plays the close animation then removes the popup after the close button is clicked
    function closePopup():void {
        setPopupClasses('popupWrapper');
        setTimeout(() => {
            closeFunc();
        }, 800);
    };

    return (
        <React.Fragment>
            <div className={popupClasses}>
                <button type="button" onClick={() => {closePopup()}} style={{width: '5%', float: 'right', marginRight: '10px'}}>
                    <h3 style={{color: '#909090', textDecoration: 'none'}}>
                        x
                    </h3>
                </button>
                {children}
            </div>
        </React.Fragment>
    );
};