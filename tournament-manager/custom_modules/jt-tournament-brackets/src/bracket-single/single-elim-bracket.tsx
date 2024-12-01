import React from 'react';
import { ThemeProvider } from 'styled-components';
import { sortAlphanumerically } from 'Utils/string';
import { calculateSVGDimensions } from 'Core/calculate-svg-dimensions';
import { MatchContextProvider } from 'Core/match-context';
import MatchWrapper from 'Core/match-wrapper';
import RoundHeader from 'Components/round-header';
import { getPreviousMatches } from 'Core/match-functions';
import { MatchType, SingleElimLeaderboardProps } from '../types';
import { defaultStyle, getCalculatedStyles } from '../settings';
import { calculatePositionOfMatch } from './calculate-match-position';

import Connectors from './connectors';
import defaultTheme from '../themes/themes';

function SingleEliminationBracket({
  matches,
  matchComponent,
  currentRound,
  onMatchClick,
  onPartyClick,
  svgWrapper: SvgWrapper = ({ children }) => <div>{children}</div>,
  theme = defaultTheme,
  options: { style: inputStyle } = {
    style: defaultStyle,
  },
}: SingleElimLeaderboardProps) {
  const style = {
    ...defaultStyle,
    ...inputStyle,
    roundHeader: {
      ...defaultStyle.roundHeader,
      ...(inputStyle?.roundHeader ?? {}),
    },
    lineInfo: {
      ...defaultStyle.lineInfo,
      ...(inputStyle?.lineInfo ?? {}),
    },
  };

  const { roundHeader, columnWidth, canvasPadding, rowHeight, width } =
    getCalculatedStyles(style);

  const thirdPlaceMatch = matches.find(match => match.isThirdPlaceMatch);
  const exhibitionMatches = matches.filter(match => match.isExhibitionMatch);
  const mainBracketMatches = matches.filter(
    match => match !== thirdPlaceMatch && !exhibitionMatches.includes(match)
  );

  const lastGame = mainBracketMatches.find(match => !match.nextMatchId);

  const generateColumn = (matchesColumn: MatchType[]): MatchType[][] => {
    const previousMatchesColumn = matchesColumn.reduce<MatchType[]>(
      (result, match) => {
        return [
          ...result,
          ...mainBracketMatches
            .filter(m => m.nextMatchId === match.id)
            .sort((a, b) => sortAlphanumerically(a.name, b.name)),
        ];
      },
      []
    );

    if (previousMatchesColumn.length > 0) {
      return [...generateColumn(previousMatchesColumn), previousMatchesColumn];
    }
    return [previousMatchesColumn];
  };
  const generate2DBracketArray = (final: MatchType) => {
    const brackets = final
      ? [...generateColumn([final]), [final]].filter(arr => arr.length > 0)
      : [];

    // Add third place match to last column
    if (thirdPlaceMatch) {
      brackets[brackets.length - 1].push(thirdPlaceMatch);
    }

    // Add exhibition matches to their respective column
    if (exhibitionMatches.length > 0) {
      const tournamentRoundTexts = brackets.map(
        column => column[0].tournamentRoundText
      );

      exhibitionMatches.forEach(match => {
        const columnNumber =
          tournamentRoundTexts.indexOf(match.tournamentRoundText) ?? 0;

        brackets[columnNumber].push(match);
      });
    }

    return brackets;
  };
  const columns = generate2DBracketArray(lastGame);
  // [
  //   [ First column, exhibition matches [optional] ]
  //   [ 2nd column, exhibition matches [optional] ]
  //   [ 3rd column, exhibition matches [optional] ]
  //   [ lastGame, thirdPlaceMatch [optional] ]
  // ]

  const columnsWithExhibitionMatcheLength = columns.some(column =>
    column.some(match => match.isExhibitionMatch)
  )
    ? columns[0].length + 1
    : columns[0].length;

  const { gameWidth, gameHeight, startPosition } = calculateSVGDimensions(
    columnsWithExhibitionMatcheLength,
    columns.length,
    rowHeight,
    columnWidth,
    canvasPadding,
    roundHeader,
    currentRound
  );

  return (
    <ThemeProvider theme={theme}>
      <SvgWrapper
        bracketWidth={gameWidth}
        bracketHeight={gameHeight}
        startAt={startPosition}
      >
        <svg
          height={gameHeight}
          width={gameWidth}
          viewBox={`0 0 ${gameWidth} ${gameHeight}`}
        >
          <MatchContextProvider>
            <g>
              {columns.map((matchesColumn, columnIndex) =>
                matchesColumn.map((match, rowIndex) => {
                  let offsetY = 0;
                  if (match.isThirdPlaceMatch) {
                    offsetY = -rowHeight * (2 ** columnIndex - 1);
                  } else if (match.isExhibitionMatch) {
                    offsetY =
                      -(2 ** columnIndex - 2) * (rowHeight / 2) - rowHeight / 2;
                  }

                  const { x, y } = calculatePositionOfMatch(
                    rowIndex,
                    columnIndex,
                    {
                      canvasPadding,
                      columnWidth,
                      rowHeight,
                      offsetY,
                    }
                  );

                  const previousBottomPosition = (rowIndex + 1) * 2 - 1;

                  const { previousTopMatch, previousBottomMatch } =
                    getPreviousMatches(
                      columnIndex,
                      columns,
                      previousBottomPosition
                    );
                  return (
                    <g key={x + y}>
                      {roundHeader.isShown && (
                        <RoundHeader
                          x={x}
                          roundHeader={roundHeader}
                          canvasPadding={canvasPadding}
                          width={width}
                          numOfRounds={columns.length}
                          tournamentRoundText={match.tournamentRoundText}
                          columnIndex={columnIndex}
                        />
                      )}
                      {columnIndex !== 0 &&
                        !match.isExhibitionMatch &&
                        !match.isThirdPlaceMatch && (
                          <Connectors
                            {...{
                              bracketSnippet: {
                                currentMatch: match,
                                previousTopMatch,
                                previousBottomMatch,
                              },
                              rowIndex,
                              columnIndex,
                              gameHeight,
                              gameWidth,
                              style,
                            }}
                          />
                        )}
                      <g>
                        <MatchWrapper
                          x={x}
                          y={
                            y +
                            (roundHeader.isShown
                              ? roundHeader.height + roundHeader.marginBottom
                              : 0)
                          }
                          rowIndex={rowIndex}
                          columnIndex={columnIndex}
                          match={match}
                          previousBottomMatch={previousBottomMatch}
                          topText={match.startTime}
                          bottomText={match.name}
                          teams={match.participants}
                          onMatchClick={onMatchClick}
                          onPartyClick={onPartyClick}
                          style={style}
                          matchComponent={matchComponent}
                        />
                      </g>
                    </g>
                  );
                })
              )}
            </g>
          </MatchContextProvider>
        </svg>
      </SvgWrapper>
    </ThemeProvider>
  );
}

export default SingleEliminationBracket;
