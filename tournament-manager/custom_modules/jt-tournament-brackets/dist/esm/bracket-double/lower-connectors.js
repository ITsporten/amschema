import { jsx as _jsx } from "react/jsx-runtime";
import Connectors from '../components/connector';
import { getCalculatedStyles } from '../settings';
import { calculatePositionOfMatchLowerBracket } from './calculate-match-position';
function ConnectorsLower({ bracketSnippet, rowIndex, columnIndex, style, offsetY = 0, }) {
    const { columnWidth, rowHeight, canvasPadding } = getCalculatedStyles(style);
    const isUpperSeedingRound = columnIndex % 2 !== 0;
    const currentMatchPosition = calculatePositionOfMatchLowerBracket(rowIndex, columnIndex, {
        canvasPadding,
        rowHeight,
        columnWidth,
        offsetY,
    });
    const previousBottomPosition = isUpperSeedingRound
        ? rowIndex
        : (rowIndex + 1) * 2 - 1;
    const previousTopMatchPosition = !isUpperSeedingRound &&
        calculatePositionOfMatchLowerBracket(previousBottomPosition - 1, columnIndex - 1, {
            canvasPadding,
            rowHeight,
            columnWidth,
            offsetY,
        });
    const previousBottomMatchPosition = calculatePositionOfMatchLowerBracket(previousBottomPosition, columnIndex - 1, {
        canvasPadding,
        rowHeight,
        columnWidth,
        offsetY,
    });
    return (_jsx(Connectors, { bracketSnippet: bracketSnippet, previousBottomMatchPosition: previousBottomMatchPosition, previousTopMatchPosition: previousTopMatchPosition, currentMatchPosition: currentMatchPosition, style: style }));
}
export default ConnectorsLower;
//# sourceMappingURL=lower-connectors.js.map