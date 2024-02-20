import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import SettingPage from "../Components/settings/SettingPage";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/SettingPage">
                <SettingPage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
