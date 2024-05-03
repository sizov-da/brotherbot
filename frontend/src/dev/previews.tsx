import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import SettingPage from "../Components/settings/SettingPage";
import AuthPage from "../Components/AuthPage/AuthPage";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/SettingPage">
                <SettingPage/>
            </ComponentPreview>
            <ComponentPreview path="/AuthPage">
                <AuthPage/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
