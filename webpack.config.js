const path = require('path');
module.exports = {
    entry: {
        bundle: './src/vanillastate.ts'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'vanillastate.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "demo"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/, loader: 'ts-loader'
            }
        ]
    }
}