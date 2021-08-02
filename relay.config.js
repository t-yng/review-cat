module.exports = {
  src: './renderer/src',
  schema: './schema.github.graphql',
  language: 'typescript',
  extensions: ['ts', 'tsx'],
  eagerESModules: true,
  customScalars: {
    URI: 'String',
  },
};
