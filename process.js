var fs = require('fs');

var directory = fs.readdirSync('.');
var IGNORED_FILES = ['./.git', './.idea', './assets.json', './process.js'];
var PATH = './assets';


function readDirRecursively(dirContents, path) {
  var results = [];
  dirContents.forEach(function (item) {
    if(IGNORED_FILES.indexOf(path + item) !== -1) {
      return;
    }

    if(fs.lstatSync(path + item).isDirectory()) {
      var newDirContents = readDirRecursively(fs.readdirSync(path + item), path + item + '/');

      results.push({
        name: item,
        contents: newDirContents
      });
    } else {
      results.push({
        id: (path.replace(/\.\//g, '') + item.split('.')[0]).replace(/ /g, '_'),
        src: path + item
      });
    }
  });

  return results;
}

var assets = readDirRecursively(directory, './');
fs.writeFileSync('assets.json', JSON.stringify({
  assets: assets,
  path: PATH
}));
