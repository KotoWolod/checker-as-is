import mocha from 'mocha';
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
import chai from 'chai';
import bytes from 'chai-bytes';
chai.use(bytes);
const { expect } = chai;

export {
    mocha, describe, it, expect, before
}
