#General info
This repository serves as an assets repository for Croconate. It contains assets in the form of single files, grouped by categories (this may be useful for the future use). Since Croconate Editor needs to handle tilesets, you have to convert assets to them using `process.js` file.

#Conversion
To convert the assets into tilemaps run `node process.js <directory name>` (in quotes, if necessary). Then `./<directory name>/` will be recursively scanned for all the images and they will be merged into tilemap. After it finishes in `processed/` you'll find two files:

* `<directory name>_assets.json` - a file describing assets and where are they stored in the tilemap
* `<directory name>_tilemap.png` - actual tilemap
