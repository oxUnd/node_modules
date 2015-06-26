var assert = require('assert');
var fis = require('fis');
var path = require('path');

var root = path.join(__dirname, 'tmp');
fis.util.mkdir(root);

// html
function Test(desc, files, main, initFn) {
  process.stdout.write('# TEST >> ' + desc);
  initFn && initFn();
  fis.config.set('modules.preprocessor.' + main['ext'] || 'js', require('..'));
  fis.config.set('settings.preprocessor.0', {});

  fis.project.setProjectRoot(root);

  fis.util.map(files, function (subpath, content) {
    fis.util.write(path.join(root, subpath), content);
  });

  var file = fis.file.wrap(path.join(root, main['path']));

  file.useCache = false;
  
  fis.compile.setup();
  fis.compile(file);
  
  assert.equal(main['expect'], file.getContent());
  process.stdout.write(' √\n');

  fis.util.del(root);
  fis.util.mkdir(root);
}


Test(
  "html use __id",
  {
    'id.js': 'console.log',
    'index.html': '__id("./id.js")'
  },
  {
    ext: 'html',
    path: 'index.html',
    expect: '"id.js"'
  }
);

Test(
  "js use __id same dir",
  {
    'main.js': 'var id = __id("./a.js");',
    'a.js': ''
  },
  {
    ext: 'js',
    path: 'main.js',
    expect: 'var id = "a.js";'
  }
);


Test(
  "js use __id subdir",
  {
    'main.js': 'var id = __id("./sub/a.js");',
    'sub/a.js': ''
  },
  {
    ext: 'js',
    path: 'main.js',
    expect: 'var id = "sub/a.js";'
  }
);

Test(
  "js use __id subdir with namespace",
  {
    'main.js': 'var id = __id("./sub/a.js");',
    'sub/a.js': ''
  },
  {
    ext: 'js',
    path: 'main.js',
    expect: 'var id = "common:sub/a.js";'
  },
  function () {
    fis.config.set('namespace', 'common');
  }
);


fis.util.del(root);