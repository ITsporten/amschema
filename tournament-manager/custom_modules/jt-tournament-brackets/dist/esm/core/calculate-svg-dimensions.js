export function calculateSVGDimensions(numOfRows, numOfColumns, rowHeight, columnWidth, canvasPadding, roundHeader, currentRound = '') {
    const bracketHeight = numOfRows * rowHeight;
    const bracketWidth = numOfColumns * columnWidth;
    const gameHeight = bracketHeight +
        canvasPadding * 2 +
        (roundHeader.isShown ? roundHeader.height + roundHeader.marginBottom : 0);
    const gameWidth = bracketWidth + canvasPadding * 2;
    const startPosition = [
        currentRound
            ? -(parseInt(currentRound, 10) * columnWidth - canvasPadding * 2)
            : 0,
        0,
    ];
    return { gameWidth, gameHeight, startPosition };
}
//# sourceMappingURL=calculate-svg-dimensions.js.map