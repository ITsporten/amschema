import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import MatchWrapper from '../core/match-wrapper';
import { calculatePositionOfFinalGame } from './calculate-match-position';
import Connectors from './final-connectors';
function FinalGame({ match, rowIndex, columnIndex, gameHeight, gameWidth, calculatedStyles, onMatchClick, onPartyClick, matchComponent, bracketSnippet, numOfUpperRounds, numOfLowerRounds, upperBracketHeight, lowerBracketHeight, }) {
    const { canvasPadding, columnWidth, rowHeight, roundHeader } = calculatedStyles;
    const { x, y } = calculatePositionOfFinalGame(rowIndex, columnIndex, {
        canvasPadding,
        columnWidth,
        rowHeight,
        gameHeight,
        upperBracketHeight,
        lowerBracketHeight,
    });
    return (_jsxs(_Fragment, { children: [columnIndex !== 0 && (_jsx(Connectors, { numOfUpperRounds,
                numOfLowerRounds,
                rowIndex,
                columnIndex,
                gameWidth,
                gameHeight,
                lowerBracketHeight,
                upperBracketHeight,
                style: calculatedStyles,
                bracketSnippet })), _jsx("g", { children: _jsx(MatchWrapper, { x: x, y: y +
                        (roundHeader.isShown
                            ? roundHeader.height + roundHeader.marginBottom
                            : 0), rowIndex: rowIndex, columnIndex: columnIndex, match: match, previousBottomMatch: bracketSnippet.previousBottomMatch, topText: match.startTime, bottomText: match.name, teams: match.participants, onMatchClick: onMatchClick, onPartyClick: onPartyClick, style: calculatedStyles, matchComponent: matchComponent }) })] }));
}
export default FinalGame;
//# sourceMappingURL=final-game.js.map