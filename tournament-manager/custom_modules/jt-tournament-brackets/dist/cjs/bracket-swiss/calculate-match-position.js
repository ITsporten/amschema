"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePositionOfMatch = void 0;
const calculatePositionOfMatch = (rowIndex, columnIndex, { canvasPadding, rowHeight, columnWidth, offsetX = 0, offsetY = 0 }) => {
    return {
        x: columnIndex * columnWidth + canvasPadding + offsetX,
        y: rowIndex * rowHeight + canvasPadding + offsetY,
    };
};
exports.calculatePositionOfMatch = calculatePositionOfMatch;
//# sourceMappingURL=calculate-match-position.js.map