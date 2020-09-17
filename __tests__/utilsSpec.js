const { mapTitleToKebabCase } = require("../utils");

const t = require('../utils.js')

test('mapTitleToKebabCase should remove the extension of the file', () => {
    expect(t.mapTitleToKebabCase('filename.md')).toEqual('filename');
});

test('mapTitleToKebabCase should lowercase the filename', () => {
    expect(t.mapTitleToKebabCase('FIlename')).toEqual('filename');
});

test('mapTitleToKebabCase should replace spaces with dashes', () => {
    expect(t.mapTitleToKebabCase('file name')).toEqual('file-name');
});

test('mapTitleToKebabCase should remove special chars', () => {
    expect(t.mapTitleToKebabCase('file !name')).toEqual('file-name');
});
