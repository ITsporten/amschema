"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const styled_components_1 = require("styled-components");
const string_1 = require("../utils/string");
const calculate_svg_dimensions_1 = require("../core/calculate-svg-dimensions");
const match_context_1 = require("../core/match-context");
const match_wrapper_1 = __importDefault(require("../core/match-wrapper"));
const round_header_1 = __importDefault(require("../components/round-header"));
const match_functions_1 = require("../core/match-functions");
const settings_1 = require("../settings");
const calculate_match_position_1 = require("./calculate-match-position");
const connectors_1 = __importDefault(require("./connectors"));
const themes_1 = __importDefault(require("../themes/themes"));
function SingleEliminationBracket({ matches, matchComponent, currentRound, onMatchClick, onPartyClick, svgWrapper: SvgWrapper = ({ children }) => (0, jsx_runtime_1.jsx)("div", { children: children }), theme = themes_1.default, options: { style: inputStyle } = {
    style: settings_1.defaultStyle,
}, }) {
    var _a, _b;
    const style = Object.assign(Object.assign(Object.assign({}, settings_1.defaultStyle), inputStyle), { roundHeader: Object.assign(Object.assign({}, settings_1.defaultStyle.roundHeader), ((_a = inputStyle === null || inputStyle === void 0 ? void 0 : inputStyle.roundHeader) !== null && _a !== void 0 ? _a : {})), lineInfo: Object.assign(Object.assign({}, settings_1.defaultStyle.lineInfo), ((_b = inputStyle === null || inputStyle === void 0 ? void 0 : inputStyle.lineInfo) !== null && _b !== void 0 ? _b : {})) });
    const { roundHeader, columnWidth, canvasPadding, rowHeight, width } = (0, settings_1.getCalculatedStyles)(style);
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
                    .sort((a, b) => (0, string_1.sortAlphanumerically)(a.name, b.name)),
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
    const { gameWidth, gameHeight, startPosition } = (0, calculate_svg_dimensions_1.calculateSVGDimensions)(columnsWithExhibitionMatcheLength, columns.length, rowHeight, columnWidth, canvasPadding, roundHeader, currentRound);
    return ((0, jsx_runtime_1.jsx)(styled_components_1.ThemeProvider, { theme: theme, children: (0, jsx_runtime_1.jsx)(SvgWrapper, { bracketWidth: gameWidth, bracketHeight: gameHeight, startAt: startPosition, children: (0, jsx_runtime_1.jsx)("svg", { height: gameHeight, width: gameWidth, viewBox: `0 0 ${gameWidth} ${gameHeight}`, children: (0, jsx_runtime_1.jsx)(match_context_1.MatchContextProvider, { children: (0, jsx_runtime_1.jsx)("g", { children: columns.map((matchesColumn, columnIndex) => matchesColumn.map((match, rowIndex) => {
                            let offsetY = 0;
                            if (match.isThirdPlaceMatch) {
                                offsetY = -rowHeight * (2 ** columnIndex - 1);
                            }
                            else if (match.isExhibitionMatch) {
                                offsetY =
                                    -(2 ** columnIndex - 2) * (rowHeight / 2) - rowHeight / 2;
                            }
                            const { x, y } = (0, calculate_match_position_1.calculatePositionOfMatch)(rowIndex, columnIndex, {
                                canvasPadding,
                                columnWidth,
                                rowHeight,
                                offsetY,
                            });
                            const previousBottomPosition = (rowIndex + 1) * 2 - 1;
                            const { previousTopMatch, previousBottomMatch } = (0, match_functions_1.getPreviousMatches)(columnIndex, columns, previousBottomPosition);
                            return ((0, jsx_runtime_1.jsxs)("g", { children: [roundHeader.isShown && ((0, jsx_runtime_1.jsx)(round_header_1.default, { x: x, roundHeader: roundHeader, canvasPadding: canvasPadding, width: width, numOfRounds: columns.length, tournamentRoundText: match.tournamentRoundText, columnIndex: columnIndex })), columnIndex !== 0 &&
                                        !match.isExhibitionMatch &&
                                        !match.isThirdPlaceMatch && ((0, jsx_runtime_1.jsx)(connectors_1.default, { bracketSnippet: {
                                            currentMatch: match,
                                            previousTopMatch,
                                            previousBottomMatch,
                                        },
                                        rowIndex,
                                        columnIndex,
                                        gameHeight,
                                        gameWidth,
                                        style })), (0, jsx_runtime_1.jsx)("g", { children: (0, jsx_runtime_1.jsx)(match_wrapper_1.default, { x: x, y: y +
                                                (roundHeader.isShown
                                                    ? roundHeader.height + roundHeader.marginBottom
                                                    : 0), rowIndex: rowIndex, columnIndex: columnIndex, match: match, previousBottomMatch: previousBottomMatch, topText: match.startTime, bottomText: match.name, teams: match.participants, onMatchClick: onMatchClick, onPartyClick: onPartyClick, style: style, matchComponent: matchComponent }) })] }, x + y));
                        })) }) }) }) }) }));
}
exports.default = SingleEliminationBracket;
//# sourceMappingURL=single-elim-bracket.js.map