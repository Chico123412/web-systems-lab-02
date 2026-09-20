const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
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
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],

    devServer: {
        port: 9000,
        open: true,
        hot: true,
        historyApiFallback: true
    },

    devtool: "source-map"
};