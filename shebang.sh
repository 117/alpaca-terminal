shebang="#!/bin/sh \n':' //# comment; exec /usr/bin/env node \"\$0\" \"\$@\""
echo $shebang | cat - dist/src/main.js > temp && mv temp dist/src/main.js
