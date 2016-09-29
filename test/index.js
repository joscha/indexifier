const fs = require('fs');
const path = require('path');
const chai = require('chai');
const chaiFiles = require('chai-files');
const { file } = chaiFiles;

const indexifier = require('../');

chai.use(chaiFiles);
chai.should();

const fixturesDir = path.join(__dirname, 'fixtures');

describe('indexifier', () => {
    describe('should be possible to transform a directory structure', () => {
        const dir = path.join(fixturesDir, '1');
        it('as-is', () => {
            const ret = indexifier(dir);
            ret.should.be.equal(file('test/fixtures/1.txt'));
        });

        it('filtered by extensions', () => {
            const ret = indexifier(dir, ['.html']);
            ret.should.be.equal(file('test/fixtures/1.filtered.txt'));
        });

        describe('html', () => {
            it('to HTML', () => {
                const ret = indexifier(dir, null, true);
                ret.should.be.equal(file('test/fixtures/1.html'));
            });
        });
    });
});
