module.exports = {
  plugins: [
    [
      "postcss-preset-env",
      require("autoprefixer")({
        overrideBrowserslist: ["last 10 versions", "not ie < 9"],
      }),
      require("cssnano")({
        preset: [
          "default",
          {
            discardComments: {
              removeAll: true,
              cssDeclarationSorter: true,
            },
          },
        ],
      }),
    ],
  ],
};
