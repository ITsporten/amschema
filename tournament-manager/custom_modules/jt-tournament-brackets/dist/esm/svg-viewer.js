var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useState, useRef } from 'react';
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_AUTO } from 'react-svg-pan-zoom';
import { precisionRound } from './utils/numbers';
function SvgViewer(_a) {
    var { height = 500, width = 500, bracketWidth, bracketHeight, children, startAt = [0, 0], scaleFactor = 1.1, customToolbar = null } = _a, rest = __rest(_a, ["height", "width", "bracketWidth", "bracketHeight", "children", "startAt", "scaleFactor", "customToolbar"]);
    const Viewer = useRef(null);
    const [tool, setTool] = useState(TOOL_AUTO);
    const [value, setValue] = useState(INITIAL_VALUE);
    const [scaleFactorMin, setScaleFactorMin] = useState(1);
    const scaleFactorMax = 1.25;
    useEffect(() => {
        Viewer.current.pan(...startAt);
    }, []);
    const lockToBoundaries = v => {
        const zoomFactor = v.a || v.d;
        const scaledMaxHeight = v.SVGHeight * zoomFactor - v.viewerHeight;
        const scaledMaxWidth = v.SVGWidth * zoomFactor - v.viewerWidth;
        const heightRatio = precisionRound(v.viewerHeight / v.SVGHeight, 2);
        const widthRatio = precisionRound(v.viewerWidth / v.SVGWidth, 2);
        setScaleFactorMin(Math.max(heightRatio, widthRatio));
        setValue(Object.assign(Object.assign({}, v), { e: v.e > 0 ? 0 : v.e < 0 - scaledMaxWidth ? 0 - scaledMaxWidth : v.e, f: v.f > 0 ? 0 : v.f < 0 - scaledMaxHeight ? 0 - scaledMaxHeight : v.f }));
    };
    return (_jsx(ReactSVGPanZoom, Object.assign({ detectAutoPan: false, ref: Viewer, scaleFactor: scaleFactor, scaleFactorMax: scaleFactorMax, scaleFactorMin: scaleFactorMin, width: Math.min(width, bracketWidth), height: Math.min(height, bracketHeight), tool: tool, onChangeTool: setTool, value: value, onChangeValue: setValue, onZoom: lockToBoundaries, onPan: lockToBoundaries, miniatureProps: { position: 'right' }, customToolbar: customToolbar !== null && customToolbar !== void 0 ? customToolbar : (() => _jsx(_Fragment, {})) }, rest, { children: children })));
}
export default SvgViewer;
//# sourceMappingURL=svg-viewer.js.map