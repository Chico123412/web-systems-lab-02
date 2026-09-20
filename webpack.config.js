const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (_env, argv) => {
    const isProduction = argv.mode === "production";

    return {
        entry: "./src/index.ts",

        output: {
            filename: "bundle.[contenthash].js",
            path: path.resolve(__dirname, "dist"),
            clean: true
        },

        resolve: {
            extensions: [".ts", ".js"]
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.s?css$/,
                    use: [
                        isProduction
                            ? MiniCssExtractPlugin.loader
                            : "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: "./index.html"
            }),
            ...(isProduction
                ? [
                    new MiniCssExtractPlugin({
                        filename: "styles.[contenthash].css"
                    })
                ]
                : [])
        ],

        devServer: {
            port: 9000,
            open: true,
            hot: true,
            historyApiFallback: true
        },

        devtool: isProduction ? "source-map" : "eval-source-map",

        performance: {
            hints: isProduction ? "warning" : false,
            maxAssetSize: 300000,
            maxEntrypointSize: 400000
        }
    };
};