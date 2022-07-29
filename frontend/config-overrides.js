// Instructions: https://github.com/ChainSafe/web3.js
const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve('buffer'),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve('os-browserify/browser'),
        "url": require.resolve("url"),
        "fs": require.resolve('fs')
    })
    config.resolve.fallback = fallback;
    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"];
    config.ignoreWarnings = [/Failed to parse source map/]; // Ignore warnings
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])    
    return config;
}