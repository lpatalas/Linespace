module.exports = {
    entry: './src/main.ts',
    output: {
        path: './bin',
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts/, loader: 'ts-loader' }
        ]
    }
};
