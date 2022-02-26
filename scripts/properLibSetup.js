const assert = require('assert');
const Fs = require('fs');
const Path = require('path');

const paths = {
    root: (...path) => Path.resolve(__dirname, '..', ...path),
    types: (...path) => paths.root('types', ...path)
}

const types = Fs.readdirSync(paths.types());

const assertFileExist = (path) => Fs.statSync(path, { throwIfNoEntry: true })
const assetNotEmpty = (path) => {

    const contents = Fs.readFileSync(path).toString('utf-8');

    const commentRgx = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
    const empty = contents.replace(commentRgx, '').trim();

    assert.ok(empty, `${path} is empty`);
}

const red = (msg) => `\x1b[31m${msg}\x1b[0m`;
const green = (msg) => `\x1b[32m${msg}\x1b[0m`;
const yellow = (msg) => `\x1b[33m${msg}\x1b[0m`;

const warn = (...msg) => {
    console.log()
    console.log(yellow('Warning:'), msg.map(yellow).join(' '));
    console.log()
}

const assertLibSetup = (folder) => {

    const pkg = require(
        paths.types(folder, 'package.json')
    );

    const msg = (val) => `${folder}: ${val}`;

    const missingOrIncorrect = (val) => msg(`package.json ${val} field is missing or incorrect`)

    // Make sure that the name of the package is properly prefixed
    assert.match(pkg.name, /@hapipal\/types\-/);

    const name = pkg.name.replace('@hapipal/types-', '');


    if (name !== folder) {
        warn(
            'Package name for', green(`'${name}'`),
            'does not match the folder name', green(`'${folder}'.`),
            'Was this intentional?'
        )
    }

    // types and always index.d.ts
    assert.equal(pkg.types, 'index.d.ts', missingOrIncorrect('`types`'));

    // license is always MIT
    assert.equal(pkg.license, 'MIT', missingOrIncorrect('`license`'));

    // npm test is always tsc
    assert.equal(pkg.scripts?.test, 'tsc', missingOrIncorrect('npm `test` script'));

    // don't forget to set the repo
    assert.ok(pkg.repository, msg('package.json `repository`'));
    assert.equal(pkg.repository.directory, `types/${name}`, missingOrIncorrect('repository `directory`'));

    // don't forget to set where to report bug
    assert.deepEqual(pkg.bugs, {
        url: 'https://github.com/hapipal/types/issues'
    }, missingOrIncorrect('`bugs`'));

    // don't forget to make the home page the right folder
    assert.match(pkg.homepage, new RegExp(`types/${folder}$`, 'i'), missingOrIncorrect('`homepage`'));

    // tsconfig is required
    assertFileExist(paths.types(folder, 'tsconfig.json'));

    // test.ts is required and the name that will be used
    assertFileExist(paths.types(folder, 'test.ts'));
    assetNotEmpty(paths.types(folder, 'test.ts'));

    // index.d.ts is required and the name that will be used
    assertFileExist(paths.types(folder, 'index.d.ts'));
    assetNotEmpty(paths.types(folder, 'index.d.ts'));


    // LICENSE is required and the name that will be used
    assertFileExist(paths.types(folder, 'LICENSE'));
    assetNotEmpty(paths.types(folder, 'LICENSE'));
}

let exitCode = 0;

for (const folder of types) {

    try {
        assertLibSetup(folder);

        console.log(green('✓'), folder);
    }
    catch (e) {

        exitCode = 1;
        console.log(red('✖'), red(e.message));
    }
}

if (exitCode === 0) {

    console.log();
    console.log(green('😊 all packages are properly configured...'));
    console.log();
}

process.exit(exitCode);