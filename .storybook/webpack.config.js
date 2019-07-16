const path = require('path');

module.exports = async ({ config, mode }) => {

  config.module.rules.push({
    test: /\.tsx?$/,
    loader: 'ts-loader',
    include: [
      path.join(__dirname, '../src'),
      path.join(__dirname, '../stories')
    ],
    options: {
      transpileOnly: true
    }
  });

  config.resolve =  {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  };

  return config;
};
