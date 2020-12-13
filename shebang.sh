shebang="#!/bin/sh \n':' //# comment; exec /usr/bin/env node \"\$0\" \"\$@\""
echo $shebang | cat - dist/src/terminal.js > temp && mv temp dist/src/terminal.js
