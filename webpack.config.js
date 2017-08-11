module.exports = {
  entry: "./index.jsx",
  output: {
    path: "./",
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
