import React from 'react';

interface params {
    title: string;
    subtitle: string;
};

export default function PageHeader({title, subtitle}:params):React.ReactElement {

    return (
        <React.Fragment>
            <h1>
                {title}
            </h1>
            <p>
                {subtitle}
            </p>
            <div className="dividerLine"></div>
        </React.Fragment>
    );
};