var path = require('path');

module.exports = {
    entry: './app/main.ts',
    output: {
        path: './app/bin',
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /(\.vert|\.frag)/, loader: 'raw' },
            { test: /\.ts/, loader: 'ts-loader' }
        ]
    }
};
