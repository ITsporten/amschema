import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemeProvider } from 'styled-components';
import { sortAlphanumerically } from '../utils/string';
import { calculateSVGDimensions } from '../core/calculate-svg-dimensions';
import { MatchContextProvider } from '../core/match-context';
import MatchWrapper from '../core/match-wrapper';
import RoundHeader from '../components/round-header';
import { getPreviousMatches } from '../core/match-functions';
import { defaultStyle, getCalculatedStyles } from '../settings';
import { calculatePositionOfMatch } from './calculate-match-position';
import Connectors from './connectors';
import defaultTheme from '../themes/themes';
function SingleEliminationBracket({ matches, matchComponent, currentRound, onMatchClick, onPartyClick, svgWrapper: SvgWrapper = ({ children }) => _jsx("div", { children: children }), theme = defaultTheme, options: { style: inputStyle } = {
    style: defaultStyle,
}, }) {
    var _a, _b;
    const style = Object.assign(Object.assign(Object.assign({}, defaultStyle), inputStyle), { roundHeader: Object.assign(Object.assign({}, defaultStyle.roundHeader), ((_a = inputStyle === null || inputStyle === void 0 ? void 0 : inputStyle.roundHeader) !== null && _a !== void 0 ? _a : {})), lineInfo: Object.assign(Object.assign({}, defaultStyle.lineInfo), ((_b = inputStyle === null || inputStyle === void 0 ? void 0 : inputStyle.lineInfo) !== null && _b !== void 0 ? _b : {})) });
    const { roundHeader, columnWidth, canvasPadding, rowHeight, width } = getCalculatedStyles(style);
    const thirdPlaceMatch = matches.find(match => match.isThirdPlaceMatch);
    const exhibitionMatches = matches.filter(match => match.isExhibitionMatch);
    const mainBracketMatches = matches.filter(match => match !== thirdPlaceMatch && !exhibitionMatches.includes(match));
    const lastGame = mainBracketMatches.find(match => !match.nextMatchId);
    const generateColumn = (matchesColumn) => {
        const previousMatchesColumn = matchesColumn.reduce((result, match) => {
            return [
                ...result,
                ...mainBracketMatches
                    .filter(m => m.nextMatchId === match.id)
                    .sort((a, b) => sortAlphanumerically(a.name, b.name)),
            ];
        }, []);
        if (previousMatchesColumn.length > 0) {
            return [...generateColumn(previousMatchesColumn), previousMatchesColumn];
        }
        return [previousMatchesColumn];
    };
    const generate2DBracketArray = (final) => {
        const brackets = final
            ? [...generateColumn([final]), [final]].filter(arr => arr.length > 0)
            : [];
        if (thirdPlaceMatch) {
            brackets[brackets.length - 1].push(thirdPlaceMatch);
        }
        if (exhibitionMatches.length > 0) {
            const tournamentRoundTexts = brackets.map(column => column[0].tournamentRoundText);
            exhibitionMatches.forEach(match => {
                var _a;
                const columnNumber = (_a = tournamentRoundTexts.indexOf(match.tournamentRoundText)) !== null && _a !== void 0 ? _a : 0;
                brackets[columnNumber].push(match);
            });
        }
        return brackets;
    };
    const columns = generate2DBracketArray(lastGame);
    const columnsWithExhibitionMatcheLength = columns.some(column => column.some(match => match.isExhibitionMatch))
        ? columns[0].length + 1
        : columns[0].length;
    const { gameWidth, gameHeight, startPosition } = calculateSVGDimensions(columnsWithExhibitionMatcheLength, columns.length, rowHeight, columnWidth, canvasPadding, roundHeader, currentRound);
    return (_jsx(ThemeProvider, { theme: theme, children: _jsx(SvgWrapper, { bracketWidth: gameWidth, bracketHeight: gameHeight, startAt: startPosition, children: _jsx("svg", { height: gameHeight, width: gameWidth, viewBox: `0 0 ${gameWidth} ${gameHeight}`, children: _jsx(MatchContextProvider, { children: _jsx("g", { children: columns.map((matchesColumn, columnIndex) => matchesColumn.map((match, rowIndex) => {
                            let offsetY = 0;
                            if (match.isThirdPlaceMatch) {
                                offsetY = -rowHeight * (2 ** columnIndex - 1);
                            }
                            else if (match.isExhibitionMatch) {
                                offsetY =
                                    -(2 ** columnIndex - 2) * (rowHeight / 2) - rowHeight / 2;
                            }
                            const { x, y } = calculatePositionOfMatch(rowIndex, columnIndex, {
                                canvasPadding,
                                columnWidth,
                                rowHeight,
                                offsetY,
                            });
                            const previousBottomPosition = (rowIndex + 1) * 2 - 1;
                            const { previousTopMatch, previousBottomMatch } = getPreviousMatches(columnIndex, columns, previousBottomPosition);
                            return (_jsxs("g", { children: [roundHeader.isShown && (_jsx(RoundHeader, { x: x, roundHeader: roundHeader, canvasPadding: canvasPadding, width: width, numOfRounds: columns.length, tournamentRoundText: match.tournamentRoundText, columnIndex: columnIndex })), columnIndex !== 0 &&
                                        !match.isExhibitionMatch &&
                                        !match.isThirdPlaceMatch && (_jsx(Connectors, { bracketSnippet: {
                                            currentMatch: match,
                                            previousTopMatch,
                                            previousBottomMatch,
                                        },
                                        rowIndex,
                                        columnIndex,
                                        gameHeight,
                                        gameWidth,
                                        style })), _jsx("g", { children: _jsx(MatchWrapper, { x: x, y: y +
                                                (roundHeader.isShown
                                                    ? roundHeader.height + roundHeader.marginBottom
                                                    : 0), rowIndex: rowIndex, columnIndex: columnIndex, match: match, previousBottomMatch: previousBottomMatch, topText: match.startTime, bottomText: match.name, teams: match.participants, onMatchClick: onMatchClick, onPartyClick: onPartyClick, style: style, matchComponent: matchComponent }) })] }, x + y));
                        })) }) }) }) }) }));
}
export default SingleEliminationBracket;
//# sourceMappingURL=single-elim-bracket.js.map