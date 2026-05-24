import React from 'react';

interface params {
    left: boolean;
    heading: string;
    children: React.ReactNode;
}

export default function GenericMarkupSection({left, heading, children}:params):React.ReactElement {

    const alignment:string = left ? "alignLeft" : "alignRight";

    return (
        <section className={alignment}>
            <h2>
                {heading}
            </h2>

            {children}

            <div className={"sectionDivider glow"} />
        </section>
    )
}