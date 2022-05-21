// var sidebarTxt='* [首页](/)\n';
var sidebarTxt='';
var path = require('path');
var curPath = path.resolve('./');

function walkSync(currentDirPath, prefixBlank, callback) {
    var fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && ".git"!=path.basename(filePath) && '_' != path.basename(filePath).substr(0,1)) {
            var relativeFilePath = filePath.substr(curPath.length);
            //sidebarTxt += prefixBlank +'* [' +path.basename(filePath)+']('+ relativeFilePath +'/README.md)\n';
            sidebarTxt += prefixBlank +'* [' +path.basename(filePath)+']()\n';
            walkSync(filePath, prefixBlank+'  ', callback);
        }
    });
}
walkSync(curPath,'', function(filePath, stat) {
        if(".md" == path.extname(filePath).toLowerCase() 
            && '_' != path.basename(filePath).substr(0,1) 
            && 'README.md' != path.basename(filePath)){
            var relativeFilePath = filePath.substr(curPath.length);
            //console.log("file:"+ path.basename(filePath).slice(1));
            var itemText = relativeFilePath.substr(1, relativeFilePath.length-4);
            while(itemText.indexOf('/')>0){
                itemText = itemText.substr(itemText.indexOf('/')+1);
                if(relativeFilePath.substr(-8,8) == 'README.md'){
                    sidebarTxt += '';
                }
                else{
                    sidebarTxt += '     ';
                }
            }
        if(relativeFilePath.substr(-8,8) == 'README.md'){
            sidebarTxt += '';
        }else{
            sidebarTxt += '     - ['+itemText+']('+relativeFilePath+')\n';
        }  
        }
        //console.log("file:"+ +path.extname(filePath));
});

var path = require('path');
var fs = require('fs');


console.log(sidebarTxt);
fs.writeFile('./_sidebar.md', sidebarTxt,function(err){
    if(err){
        console.error(err);
    }
});
