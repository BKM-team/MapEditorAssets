var fs = require('fs');

var directory = fs.readdirSync('.');
var ignore = ['./.git', './.idea', './assets.json', './process.js'];

function readDirRecursively(dirContents, path) {
  var results = [];
  dirContents.forEach(function (item) {
    if(ignore.indexOf(path + item) !== -1) {
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
        id: item.split('.')[0],
        src: path + item
      });
    }
  });

  return results;
}

var assets = readDirRecursively(directory, './');
fs.writeFileSync('assets.json', JSON.stringify(assets));
