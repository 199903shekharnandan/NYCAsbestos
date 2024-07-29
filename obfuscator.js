'use strict';
const JavaScriptObfuscator = require('webpack-obfuscator');
module.exports = {
    plugins: [
        new JavaScriptObfuscator({
            rotateStringArray: true
        }, [  //_Deploy_Check
            '0-es2015.f2498ccff0ec5b1b5863.js'
        ])
    ]
};
