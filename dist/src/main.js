#!/bin/sh 
':' //# comment; exec /usr/bin/env node --experimental-top-level-await --no-warnings --experimental-json-modules --experimental-import-meta-resolve "$0" "$@"
import { Terminal } from './terminal.js';
// forever
new Terminal().loop();
