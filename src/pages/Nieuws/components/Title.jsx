import React from "react";
import "./Title.scss";

function Title(props) {
    return(
        <div className="title_class_1">
            <h1 className={"title_class_2" + (props.position === "left" ? " textLeft" : " textRight")}>
                {props.title}
            </h1>
        </div>
    )
}

export default Title;