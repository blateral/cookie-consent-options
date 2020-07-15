/* eslint-disable prettier/prettier */
const path = require("path");

module.exports = {
    mode: "production",
    entry: ["./src/static.ts"],
    output: {
        filename: "cookie-consent.min.js",
        path: path.resolve(__dirname, "example-static")
    },
    devServer: {
        contentBase: "./example-static",
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3|css)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]"
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
};
