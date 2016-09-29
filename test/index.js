const fs = require('fs');
const path = require('path');
const chai = require('chai');

const indexifier = require('../');

chai.should();

const fixturesDir = path.join(__dirname, 'fixtures');

describe('indexifier', () => {
    describe('should be possible to transform a directory structure', () => {
        const dir = path.join(fixturesDir, '1');
        it('as-is', () => {
            const ret = indexifier(dir);
            ret.should.be.equal(
`1
├─┬ A
│ └── c.html
├── a.html
├── a.txt
└── b.html
`);
        });

        it('filtered by extensions', () => {
            const ret = indexifier(dir, ['.html']);
            ret.should.be.equal(
`1
├─┬ A
│ └── c.html
├── a.html
└── b.html
`);
        });

        describe('html', () => {
            it('to HTML', () => {
                const ret = indexifier(dir, null, true);
                ret.should.be.equal(fs.readFileSync(path.join(fixturesDir, '1.html'), 'utf8'));
            });
        });
    });
});
