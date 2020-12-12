shebang="#!/bin/sh \n':' //# comment; exec /usr/bin/env node --experimental-top-level-await --no-warnings --experimental-json-modules --experimental-import-meta-resolve \"\$0\" \"\$@\""
echo $shebang | cat - dist/src/main.js > temp && mv temp dist/src/main.js
