var fs = require('fs');
var Spritesmith = require('spritesmith');

var PATH = './assets/';
var pathsToIds = {};
var files = [];

function readDirRecursivelyAndCollectImageData(dirContents, path) {
  dirContents.forEach(function (item) {
    var fullPath = path + item,
        id;

    if(fs.lstatSync(fullPath).isDirectory()) {
      readDirRecursivelyAndCollectImageData(fs.readdirSync(fullPath), fullPath + '/');
    } else {
      id = (path.replace(/\.\//g, '') + item.split('.')[0]).replace(/ /g, '_');

      pathsToIds[fullPath] = id;
      files.push(path + item);
    }
  });
}

var directoryName;
if(!process.argv[2]) {
  throw new Error('No directory specified');
} else {
  directoryName = process.argv[2];
}

if(!fs.existsSync('./' + directoryName) || !fs.lstatSync('./' + directoryName).isDirectory()) {
  throw new Error('Argument must be directory name');
}


var directory = fs.readdirSync('./' + directoryName);
readDirRecursivelyAndCollectImageData(directory, './' + directoryName + '/');

Spritesmith({
  src: files,
  exportOpts: {
    format: 'png'
  }
}, function (err, result) {
  var assets = [];

  if(err === null) {
    Object.getOwnPropertyNames(pathsToIds).forEach(function (path) {
      assets.push({
        id: pathsToIds[path],
        coords: {
          x: result.coordinates[path].x,
          y: result.coordinates[path].y
        }
      });
    });

    var outputPrefix = 'processed/' + directoryName.replace(/ /g, '_');

    if(!fs.existsSync('processed')) {
      fs.mkdirSync('processed');
    }

    if(fs.existsSync(outputPrefix + '_assets.json')) {
      fs.unlinkSync(outputPrefix + '_assets.json');
    }

    fs.writeFileSync(outputPrefix + '_assets.json', JSON.stringify({
      assets: assets,
      path: PATH + 'processed/',
      size: 32 //TODO: replace me by a parameter some day
    }));

    if(fs.existsSync(outputPrefix + '_tilemap.png')) {
      fs.unlinkSync(outputPrefix + '_tilemap.png');
    }

    fs.writeFileSync(outputPrefix + '_tilemap.png', result.image, 'binary');
  } else {
    console.log(err);
  }
});
