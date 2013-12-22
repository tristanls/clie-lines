/*

index.js - "clie-lines": Emit lines

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

/*
  * `args`: _Array_ Array of arguments
    * `readableStream`: _Stream_ Readable stream to parse lines from.
*/
var lines = module.exports = function (args) {
    var self = this;
    if (args.length < 1) return self.data(lines.usage).end();

    var reader = args.shift();

    var lastNewlineIndex = 0;
    var dataBuffer = "";

    reader.on('readable', function () {
        var data = reader.read();

        if (dataBuffer.length > 0) {
            data = dataBuffer + data;
            dataBuffer = "";
            lastNewlineIndex = 0;
        }

        for (var i = 0; i < data.length; i++) {
            if (data[i] === '\n') {
                if (i >= 0) {
                    self.data(data.slice(lastNewlineIndex, i));
                }
                lastNewlineIndex = i + 1;
            }
        }

        if (lastNewlineIndex != data.length) {
            dataBuffer = dataBuffer + data.slice(lastNewlineIndex);
        }
    });
    reader.on('end', function () {
        if (dataBuffer) {
            self.data(dataBuffer);
        }
        lines.end();
    });
});