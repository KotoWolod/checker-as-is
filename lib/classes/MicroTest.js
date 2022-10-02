export default class MicroTest {

    START = new Proxy(this, {
        get(target, name) {
            target.info.time(name);
            target.info.info(`${name} ->`)
        }
    });

    STOP = new Proxy(this, {
        get(target, name) {
            target.info.timeEnd(name);
        }
    });

    FINISH = new Proxy(this, {
        get(target, name) {
            target.info.timeEnd(name);
            if(target.filedTest) {
                console.error(`\u2717 failed tests ${target.filedTest} \u2717`);
                throw (new Error(`failed tests ${target.filedTest}`)).message;
            }
        }
    });

    METHOD = new Proxy(this, {
        get(target, name) {
            return (arg)=>{
                target.is.class(arg) && arg.hasOwnProperty(name) && target.is.function(arg[name])
                    ? target.passed.METHOD(name)
                    : target.failed.METHOD(name)
            };
        }
    });

    PROPERTY = new Proxy(this, {
        get(target, name) {
            return (arg)=> {
                target.is.class(arg) && arg.hasOwnProperty(name) && target.is.objectClass(arg[name])
                    ? target.passed.PROPERTY(name)
                    : target.failed.PROPERTY(name)
            };
        }
    });

    IS = new Proxy(this, {
        get(target, name) {
            return (arg)=> {
                let meOut;
                switch (true) {
                    case name.toLowerCase() === 'ok':
                    case name.toLowerCase() === 'true': meOut = target.is.boolean(arg) && arg;
                        break;
                    case name.toLowerCase() === 'notOk':
                    case name.toLowerCase() === 'false': meOut = target.is.boolean(arg) && !arg;
                        break;
                    default:
                        meOut = target.is[name](arg);
                }
                meOut
                    ? target.passed.IS(name)
                    : target.failed.IS(name)
            };
        }
    });

    passed = new Proxy(this, {
        get(target, name) {
            return (arg)=> target.info.log(`\u2713 ${name}.${arg} `);
        }
    });

    failed = new Proxy(this, {
        get(target, name) {
            target.filedTest++;
            const { stack } = new Error();
            return (arg)=> target.info.error( `\u2717 ${name}.${arg} ->${stack.split('at')[3].replace('\n','')}`);
        }
    });

    filedTest = 0;
    constructor( options = { silentMode: false, is, as }) {
        const { silentMode, is, as } = options;
        this.is = is;
        this.as = as;
        is.boolean(silentMode) && silentMode
            ? this.info = { log: ()=> {}, time: ()=> {}, timeEnd:()=> {}, error:()=> {}}
            : this.info = console;
    }
}
