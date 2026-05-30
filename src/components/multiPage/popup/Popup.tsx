import React from 'react';
import {createPortal} from "react-dom";
import './popup.scss';

interface params {
    closeFunction?: (event:React.MouseEvent) => void;
    children: React.ReactNode;
    title: string;
}

export default function Popup({closeFunction, children, title}:params):React.ReactElement {

    return createPortal(
        <div className={"popupWrapper"} onClick={(event:React.MouseEvent) => {event.stopPropagation(); popupClosed(event)}}>
            <div className={"card"} onClick={e => e.stopPropagation()}>

                {/*popup title*/}
                <div className={"heading"}>
                    <h2>
                        {title}
                    </h2>
                    <button type={"button"}
                            onClick={(event:React.MouseEvent) => {popupClosed(event)}}
                            className={"close icon"}
                            aria-label={"Close popup"} >
                        ✕
                    </button>
                </div>

                {/*popup content*/}
                {children}
            </div>
        </div>
        ,document.body    //render the body outside the popup
    )

    function popupClosed(event:React.MouseEvent):void {
        event.preventDefault();

        if (closeFunction) {
            closeFunction(event);
        }
    }
}