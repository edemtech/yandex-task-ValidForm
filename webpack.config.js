module.exports = {
  entry: "./index.jsx",
  output: {
    path: "./build",
    filename: "index.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: "babel"
      }
    ]
  }
};
