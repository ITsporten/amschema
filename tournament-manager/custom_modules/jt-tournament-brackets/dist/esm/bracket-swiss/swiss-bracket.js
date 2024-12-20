import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemeProvider } from 'styled-components';
import { calculateSVGDimensions } from '../core/calculate-svg-dimensions';
import { MatchContextProvider } from '../core/match-context';
import MatchWrapper from '../core/match-wrapper';
import RoundHeader from '../components/round-header';
import { getPreviousMatches } from '../core/match-functions';
import { defaultStyle, getCalculatedStyles } from '../settings';
import { calculatePositionOfMatch } from './calculate-match-position';
import defaultTheme from '../themes/themes';
function SwissBracket({ matches, matchComponent, currentRound, onMatchClick, onPartyClick, svgWrapper: SvgWrapper = ({ children }) => _jsx("div", { children: children }), theme = defaultTheme, options: { style: inputStyle } = {
    style: defaultStyle,
}, }) {
    var _a, _b;
    const style = Object.assign(Object.assign(Object.assign({}, defaultStyle), inputStyle), { roundHeader: Object.assign(Object.assign({}, defaultStyle.roundHeader), ((_a = inputStyle === null || inputStyle === void 0 ? void 0 : inputStyle.roundHeader) !== null && _a !== void 0 ? _a : {})), lineInfo: Object.assign(Object.assign({}, defaultStyle.lineInfo), ((_b = inputStyle === null || inputStyle === void 0 ? void 0 : inputStyle.lineInfo) !== null && _b !== void 0 ? _b : {})) });
    const { roundHeader, columnWidth, canvasPadding, rowHeight, width } = getCalculatedStyles(style);
    const generate2DBracketArray = () => {
        const brackets = [];
        matches.forEach(match => {
            if (!brackets[match.swissRoundNumber]) {
                brackets[match.swissRoundNumber] = [];
            }
            brackets[match.swissRoundNumber].push(match);
        });
        return brackets.filter(column => !!column);
    };
    const columns = generate2DBracketArray();
    const { gameWidth, gameHeight, startPosition } = calculateSVGDimensions(Math.max(...columns.map(column => column.length)), columns.length, rowHeight, columnWidth, canvasPadding, roundHeader, currentRound);
    return (_jsx(ThemeProvider, { theme: theme, children: _jsx(SvgWrapper, { bracketWidth: gameWidth, bracketHeight: gameHeight, startAt: startPosition, children: _jsx("svg", { height: gameHeight, width: gameWidth, viewBox: `0 0 ${gameWidth} ${gameHeight}`, children: _jsx(MatchContextProvider, { children: _jsx("g", { children: columns.map((matchesColumn, columnIndex) => matchesColumn.map((match, rowIndex) => {
                            const { x, y } = calculatePositionOfMatch(rowIndex, columnIndex, {
                                canvasPadding,
                                columnWidth,
                                rowHeight,
                            });
                            const previousBottomPosition = (rowIndex + 1) * 2 - 1;
                            const { previousBottomMatch } = getPreviousMatches(columnIndex, columns, previousBottomPosition);
                            return (_jsxs("g", { children: [roundHeader.isShown && (_jsx(RoundHeader, { x: x, roundHeader: roundHeader, canvasPadding: canvasPadding, width: width, numOfRounds: columns.length, tournamentRoundText: match.tournamentRoundText, columnIndex: columnIndex })), _jsx("g", { children: _jsx(MatchWrapper, { x: x, y: y +
                                                (roundHeader.isShown
                                                    ? roundHeader.height + roundHeader.marginBottom
                                                    : 0), rowIndex: rowIndex, columnIndex: columnIndex, match: match, previousBottomMatch: previousBottomMatch, topText: match.startTime, bottomText: match.name, teams: match.participants, onMatchClick: onMatchClick, onPartyClick: onPartyClick, style: style, matchComponent: matchComponent }) })] }, x + y));
                        })) }) }) }) }) }));
}
export default SwissBracket;
//# sourceMappingURL=swiss-bracket.js.map