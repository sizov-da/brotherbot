import React from "react";

const Breadcrumbs = ({ breadcrumbPath, goBackInBreadcrumb }: { breadcrumbPath: string[], goBackInBreadcrumb: (index: number) => void }) => {
    return (
        <div>

            <button onClick={() => goBackInBreadcrumb(-1)}> В начало</button>
            {breadcrumbPath.map((folder, index) => (
                <span key={index}>

                    <button onClick={() => goBackInBreadcrumb(index)}>{folder}</button>
                    {index < breadcrumbPath.length - 1 && " > "}
                </span>
            ))}
        </div>
    );
};


export default Breadcrumbs;