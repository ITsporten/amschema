import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

import Match from 'Components/match';
import { createTheme } from 'Themes/themes';
import SingleElimBracketLeaderboard from './single-elim-bracket';
import {
  walkOverData,
  simpleBracket,
  simpleSmallBracket,
} from '../mock-data/simple-data';
import soloWalkover from '../mock-data/solo-walkover';

export default {
  title: 'Components/Bracket',
  component: SingleElimBracketLeaderboard,
};

function Template({ ...args }) {
  return (
    <SingleElimBracketLeaderboard
      // currentRound={4}

      {...args}
    />
  );
}

export const Bracket = Template.bind({});
Bracket.args = {
  matches: simpleBracket,
  matchComponent: Match,
};
export const SmallBracket = Template.bind({});
SmallBracket.args = {
  matches: simpleSmallBracket,
  matchComponent: Match,
};
export const WalkOverBracket = Template.bind({});
WalkOverBracket.args = {
  matches: walkOverData,
  matchComponent: Match,
};
export const SoloWalkOverBracket = Template.bind({});
SoloWalkOverBracket.args = {
  matches: soloWalkover,
  matchComponent: Match,
};

export const SoloWalkOverBracketCustomHeaders = Template.bind({});
SoloWalkOverBracketCustomHeaders.args = {
  matches: soloWalkover,
  matchComponent: Match,
  theme: createTheme({ fontFamily: 'monospace' }),
  options: {
    style: {
      roundHeader: {
        fontColor: undefined,
        fontFamily: undefined,
        roundTextGenerator: (currentRoundNumber, roundsTotalNumber) => {
          if (currentRoundNumber === roundsTotalNumber) {
            return 'Grand Top';
          }
          if (currentRoundNumber === roundsTotalNumber - 1) {
            return 'Semi Top';
          }
          if (currentRoundNumber < roundsTotalNumber - 1) {
            return `Top ${currentRoundNumber}`;
          }
        },
      },
    },
  },
};

export const CustomMatchViewBracket = Template.bind({});
CustomMatchViewBracket.args = {
  matches: simpleBracket,
  matchComponent: ({
    match,
    onMatchClick,
    onPartyClick,
    onMouseEnter,
    onMouseLeave,
    topParty,
    bottomParty,
    topWon,
    bottomWon,
    topHovered,
    bottomHovered,
    topText,
    bottomText,
    connectorColor,
    computedStyles,
  }) => (
    <div>
      <div />
      <div />
    </div>
  ),
};
