import { sortAlphanumerically } from '../utils/string';
export const generatePreviousRound = (matchesColumn, listOfMatches) => matchesColumn.reduce((result, match) => {
    return [
        ...result,
        ...listOfMatches
            .filter(m => m.nextMatchId === match.id)
            .sort((a, b) => sortAlphanumerically(a.name, b.name)),
    ];
}, []);
export function getPreviousMatches(columnIndex, columns, previousBottomPosition) {
    const previousTopMatch = columnIndex !== 0 && columns[columnIndex - 1][previousBottomPosition - 1];
    const previousBottomMatch = columnIndex !== 0 && columns[columnIndex - 1][previousBottomPosition];
    return { previousTopMatch, previousBottomMatch };
}
export function sortTeamsSeedOrder(previousBottomMatch) {
    return (partyA, partyB) => {
        var _a, _b;
        const partyAInBottomMatch = (_a = previousBottomMatch === null || previousBottomMatch === void 0 ? void 0 : previousBottomMatch.participants) === null || _a === void 0 ? void 0 : _a.find(p => p.id === partyA.id);
        const partyBInBottomMatch = (_b = previousBottomMatch === null || previousBottomMatch === void 0 ? void 0 : previousBottomMatch.participants) === null || _b === void 0 ? void 0 : _b.find(p => p.id === partyB.id);
        if (partyAInBottomMatch) {
            return 1;
        }
        if (partyBInBottomMatch) {
            return -1;
        }
        return 0;
    };
}
//# sourceMappingURL=match-functions.js.map