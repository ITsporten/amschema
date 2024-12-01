const {
  compilerOptions: { paths: unprocessAliases },
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require(`../tsconfig.node.json`);

const aliases = Object.keys(unprocessAliases).reduce((obj, alias) => {
  const key = alias.match(/[a-zA-Z0-9]+/g);
  const rawValue = unprocessAliases[alias][0];
  const value = rawValue.match(/[a-zA-Z0-9]+/g)[0];
  return {
    ...obj,
    [key]: value,
  };
}, {});

module.exports = aliases;
