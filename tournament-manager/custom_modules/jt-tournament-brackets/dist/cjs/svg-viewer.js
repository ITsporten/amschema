"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_svg_pan_zoom_1 = require("react-svg-pan-zoom");
const numbers_1 = require("./utils/numbers");
function SvgViewer(_a) {
    var { height = 500, width = 500, bracketWidth, bracketHeight, children, startAt = [0, 0], scaleFactor = 1.1, customToolbar = null } = _a, rest = __rest(_a, ["height", "width", "bracketWidth", "bracketHeight", "children", "startAt", "scaleFactor", "customToolbar"]);
    const Viewer = (0, react_1.useRef)(null);
    const [tool, setTool] = (0, react_1.useState)(react_svg_pan_zoom_1.TOOL_AUTO);
    const [value, setValue] = (0, react_1.useState)(react_svg_pan_zoom_1.INITIAL_VALUE);
    const [scaleFactorMin, setScaleFactorMin] = (0, react_1.useState)(1);
    const scaleFactorMax = 1.25;
    (0, react_1.useEffect)(() => {
        Viewer.current.pan(...startAt);
    }, []);
    const lockToBoundaries = v => {
        const zoomFactor = v.a || v.d;
        const scaledMaxHeight = v.SVGHeight * zoomFactor - v.viewerHeight;
        const scaledMaxWidth = v.SVGWidth * zoomFactor - v.viewerWidth;
        const heightRatio = (0, numbers_1.precisionRound)(v.viewerHeight / v.SVGHeight, 2);
        const widthRatio = (0, numbers_1.precisionRound)(v.viewerWidth / v.SVGWidth, 2);
        setScaleFactorMin(Math.max(heightRatio, widthRatio));
        setValue(Object.assign(Object.assign({}, v), { e: v.e > 0 ? 0 : v.e < 0 - scaledMaxWidth ? 0 - scaledMaxWidth : v.e, f: v.f > 0 ? 0 : v.f < 0 - scaledMaxHeight ? 0 - scaledMaxHeight : v.f }));
    };
    return ((0, jsx_runtime_1.jsx)(react_svg_pan_zoom_1.ReactSVGPanZoom, Object.assign({ detectAutoPan: false, ref: Viewer, scaleFactor: scaleFactor, scaleFactorMax: scaleFactorMax, scaleFactorMin: scaleFactorMin, width: Math.min(width, bracketWidth), height: Math.min(height, bracketHeight), tool: tool, onChangeTool: setTool, value: value, onChangeValue: setValue, onZoom: lockToBoundaries, onPan: lockToBoundaries, miniatureProps: { position: 'right' }, customToolbar: customToolbar !== null && customToolbar !== void 0 ? customToolbar : (() => (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) }, rest, { children: children })));
}
exports.default = SvgViewer;
//# sourceMappingURL=svg-viewer.js.map