import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Score, Side, StyledMatch, Team, TopText, BottomText, Wrapper, Line, Anchor, } from './styles';
function Match({ bottomHovered, bottomParty, bottomText, bottomWon, match, onMatchClick, onMouseEnter, onMouseLeave, onPartyClick, topHovered, topParty, topText, topWon, }) {
    return (_jsxs(Wrapper, { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(TopText, { children: topText }), (match.href || typeof onMatchClick === 'function') && (_jsx(Anchor, { href: match.href, onClick: event => onMatchClick === null || onMatchClick === void 0 ? void 0 : onMatchClick({ match, topWon, bottomWon, event }), children: _jsx(TopText, { children: "Match Details" }) }))] }), _jsxs(StyledMatch, { children: [_jsxs(Side, { onMouseEnter: () => onMouseEnter(topParty.id), onMouseLeave: onMouseLeave, won: topWon, hovered: topHovered, onClick: () => onPartyClick === null || onPartyClick === void 0 ? void 0 : onPartyClick(topParty, topWon), children: [_jsx(Team, { children: topParty === null || topParty === void 0 ? void 0 : topParty.name }), _jsx(Score, { won: topWon, children: topParty === null || topParty === void 0 ? void 0 : topParty.resultText })] }), _jsx(Line, { highlighted: topHovered || bottomHovered }), _jsxs(Side, { onMouseEnter: () => onMouseEnter(bottomParty.id), onMouseLeave: onMouseLeave, won: bottomWon, hovered: bottomHovered, onClick: () => onPartyClick === null || onPartyClick === void 0 ? void 0 : onPartyClick(bottomParty, bottomWon), children: [_jsx(Team, { children: bottomParty === null || bottomParty === void 0 ? void 0 : bottomParty.name }), _jsx(Score, { won: bottomWon, children: bottomParty === null || bottomParty === void 0 ? void 0 : bottomParty.resultText })] })] }), _jsx(BottomText, { children: bottomText !== null && bottomText !== void 0 ? bottomText : ' ' })] }));
}
export default Match;
//# sourceMappingURL=index.js.map