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
            { test: /\.ts/, loader: 'ts-loader' }
        ]
    }
};
