var program = require('commander');
var fs = require('fs');
var yauzl = require("yauzl");

program
  .version('0.0.1')
  .description('Decompres GZIP Image file.');


if(process.argv.length>4){
    console.log('Wrong number of parameters. Usage is broadcast <OutputLocation> <zippedimageFileName> ' );
    process.exit();
}
process.argv.forEach(function (val, index, array) {    
    if(index > 1){
   // console.log(index + ': ' + val);
    }else {

    }
  });

//console.log( 'argv 1st parameter : ' + process.argv[2]);
//console.log( 'argv 2nd parameter : ' + process.argv[3]);

  
if(!fs.existsSync(process.argv[2])){
    console.log('incorrect output location given. Usage is "node broadcast <OutputLocation> <zippedimageFileName>" ' );
    process.exit();
}

if(!fs.existsSync(process.argv[3])){    
    console.log('incorrect Image file name given. Usage is "node broadcast <OutputLocation> <zippedimageFileName>" ' );
    process.exit();
}

//unzip file
// Get a Buffer with the zip content
var fs = require("fs")
  , zip = fs.readFileSync(process.argv[3]);  
  

yauzl.open("./"+process.argv[3], {lazyEntries: true}, function(err, zipfile) {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on("entry", function(entry) {
        var fileName=entry.fileName;
      if (/\/$/.test(fileName)) {
        // Directory file names end with '/'.
        // Note that entires for directories themselves are optional.
        // An entry's fileName implicitly requires its parent directories to exist.
        zipfile.readEntry();
      } else {
        console.log("fileName : "+fileName);
        // file entry
        zipfile.openReadStream(entry, function(err, readStream) {
          if (err) throw err;
          readStream.on("end", function() {
            zipfile.readEntry();
          });
          var updatedFileName=fileName.substr(0,fileName.length-getExtension(entry.fileName).length);
          //console.log(" updated fileName : "+updatedFileName);
          var writeStream = fs.createWriteStream(process.argv[2]+"/"+updatedFileName+"-unzipped"+getExtension(entry.fileName));
          readStream.pipe(writeStream);
        });
      }
    });
  });


  function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}