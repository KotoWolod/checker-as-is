import { Checker, BaseInterface } from '../index.js';
const { multi, Interface, Strict, type, as, is }  = new Checker();

export default class MyInterface extends BaseInterface {
    constructor() {
        super(MyInterface);
        this.age = ()=> as.number;
    }

    name() {
        return as.string
    }

    static surName() {
        return as.string
    }
}
