const fs = require('fs');
const path = require('path');
const indexifier = require('../');

const fixturesDir = path.join(__dirname, 'fixtures');

describe('indexifier', () => {
    describe('should be able to transform a directory structure', () => {
        const dir = path.join(fixturesDir, '1');
        it('as-is', () => {
            const ret = indexifier(dir);
            expect(ret).toMatchSnapshot();
        });

        describe('with filtering', () => {
            it('by extensions', () => {
                const ret = indexifier(dir, { fileTypes: ['.html'] });
                expect(ret).toMatchSnapshot();
            });

            it('by regexp', () => {
                const ret = indexifier(dir, { fileTypes: [], include: '^a.(.+)$' });
                expect(ret).toMatchSnapshot();
            });

            it('by extentions and regexp', () => {
                const ret = indexifier(dir, { fileTypes: ['.html'], include: '^a.(.+)$' });
                expect(ret).toMatchSnapshot();
            });
        });

        describe('html', () => {
            it('to HTML', () => {
                const ret = indexifier(dir, { isHtml: true });
                expect(ret).toMatchSnapshot();
            });

            it('w/o linking folders', () => {
                const ret = indexifier(dir, { isHtml: true, linkFolders: false });
                expect(ret).toMatchSnapshot();
            });
        });
    });
    it('can exclude files and folders', () => {
        const dir = path.join(fixturesDir, '2');
        const ret = indexifier(dir, {
            exclude: 'node_modules|a.txt',
        });
        expect(ret).toMatchSnapshot();
    });
    it('can ignore folders that do not contain files', () => {
        const dir = path.join(fixturesDir, '3');
        expect(indexifier(dir, { fileTypes: ['.html'] })).toMatchSnapshot();
        expect(indexifier(dir, { fileTypes: ['.html'], emptyDirectories: false })).toMatchSnapshot();
    });
});
