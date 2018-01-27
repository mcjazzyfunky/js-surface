module.exports = {
    entry: './build/src/main/js-glow.js',

    externals: [{
        'js-spec': true,
        'js-surface': true 
    }],

    output: {
        path: __dirname + "/dist",
        filename: "js-glow.js",
        libraryTarget: 'umd'
    }
};
