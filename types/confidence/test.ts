import * as Confidence from '@hapipal/confidence';


type Criteria = {
    APP_ENV?: 'production' | 'staging',
    APP_DEBUG?: 'true',
    APP_ENABLE_PLUGINS?: 'true' | 'false',
    APP_DB_NAME?: string,
    APP_DB_USER?: string,
    APP_DB_PASS?: string,
};

const someCriteria: Criteria = {};

type MyExpectedStoreResults = {

    db: {
        name: string,
        user: string,
        pass: string
    },
    plugins: string[],
    debug: boolean,
    smtp: {
        sesUser?: string,
        sesPass?: string,
        smtpUser?: string,
        smtpPass?: string
    },
    t1: boolean,
    t2: boolean
};

const store = new Confidence.Store <Criteria, MyExpectedStoreResults>({
    db: {
        name: { $param: 'APP_DB_NAME' },
        user: { $param: 'APP_DB_USER' },
        pass: { $param: 'APP_DB_PASS' },
    },
    plugins: {
        $filter: 'APP_ENABLE_PLUGINS',
        true: ['1', '2', '3'],
        false: []
    },
    debug: { $param: 'APP_DEBUG' },
    smtp: {
        $filter: 'APP_ENV',
        production: {
            sesUser: 'ok',
            sesPass: 'ok',

        },
        staging: {
            smtpUser: 'ok',
            smtpPass: 'ok'
        }
    },
    t1: {
        $base: [1],
        $filter: 'APP_ENV',
        production: [2],
        staging: [0]
    },
    t2: {
        $range: [
            { limit: 1, id: '123', value: 123 },
            { limit: 1, id: '456', value: 456 },
        ],
        $meta: {
            someMeta: true
        },
        $id: 'abc',
        $coerce: 'number'
    }
});

const vals = store.get('/', someCriteria);

vals.db.name === 'test';
vals.db.user === 'test';
vals.db.pass === 'test';
vals.debug === true;
vals.plugins.map((plugin) => ({ plugin, options: {} }));
vals.smtp.sesPass === 'test';
vals.smtp.sesUser === 'test';
vals.smtp.smtpPass === 'test';
vals.smtp.smtpUser === 'test';

Object.assign({}, store.get('/db', someCriteria));
store.get('/db/user', someCriteria) === 'user';
store.get('/debug', someCriteria) === true;
store.get('/plugins', someCriteria).indexOf('test');
store.get('/smtp/sesPass', someCriteria) === 'test';
