"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(data, header = { enabled: true, capitalize: false }) {
    let table = '', pad = {};
    data.forEach((item) => Object.entries(item).forEach(([key, value]) => {
        if ((pad[key] ?? 0) <= key.length) {
            pad[key] = key.length + 1;
        }
        if ((pad[key] ?? 0) <= new String(value).length) {
            pad[key] = new String(value).length + 1;
        }
    }));
    header.enabled &&
        Array.from(Object.keys(pad)).forEach((key) => (table = table.concat((header.capitalize ? key.toUpperCase() : key).padEnd(pad[key]))));
    data.forEach((entry) => (table = table.concat(`\n`)) &&
        Object.entries(entry).forEach(([key, value]) => (table = table.concat(new String(value).padEnd(pad[key])))));
    return table.trimStart();
}
exports.default = default_1;
