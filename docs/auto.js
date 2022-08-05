const fs = require("fs");
const path = require("path");

let basepath = "./"; //解析目录路径
let filterFile = ["CNAME", "auto.js", "README.md", "_sidebar.md", "index.html", ".nojekyll", "autosidebar.js", "_sidebar.md.bak"]; //过滤文件名，使用，隔开
let stopFloor = 10; //遍历层数
let isFullPath = true; //是否输出完整路径
let divide = ">### 目录"

function getPartPath(dirPath) {
    let base = basepath.split(/\/|\\/g);
    dirPath = dirPath.split(/\/|\\/g);
    while (base.length && dirPath.length && base[0] === dirPath[0]) {
        base.shift();
        dirPath.shift();
    }
    return dirPath.join("/");
}

function isFilterPath(item) {
    for (let i = 0; i < filterFile.length; i++) {
        let reg = filterFile[i];
        if (item.match(reg) && item.match(reg)[0] === item) return true;
    }
    return false;
}

function processDir(dirPath, dirTree = [], floor = 1) {
    if (floor > stopFloor) return;
    let list = fs.readdirSync(dirPath);
    list = list.filter((item) => {
        return !isFilterPath(item);
    });
    list.forEach((itemPath) => {
        const fullPath = path.join(dirPath, itemPath);
        const fileStat = fs.statSync(fullPath);
        const isFile = fileStat.isFile();
        const dir = {
            name: isFullPath ? getPartPath(fullPath) : itemPath,
        };
        if (!isFile) {
            dir.children = processDir(fullPath, [], floor + 1);
        }
        dirTree.push(dir);
    });
    return dirTree;
}


function addlist(path, content) {
    var data = fs.readFileSync(path).toString().split(divide)[0]
    data += divide + "\n>\n"
    data += content
    fs.writeFileSync(path, data)

}


let dirTree = [];
dirTree = processDir(basepath, dirTree);
let fileTree = '';
var filepath
var nextlist = new Array();

function write(tree) {
    fileTree = ""
    let list = new Array();
    list.splice(0, list.length)
    list.length = 0
    for (let i = 0; i < tree.length; i++) {
        var filename = tree[i].name.split("/").slice(-1)
        filepath = "./" + tree[i].name.replace(filename, "") + "README.md"
        var t = filename[0].split("-")
        let tem = new Array();
        tem.length = 0
        tem = tree[i]
        tem.num = Number(t[0])
        tem.fname = t[1].replace(".md", "")
        list.push(tem)
    }

    list.sort(function(a, b) { return a.num - b.num });

    nextlist = []


    list.forEach(ele => {
        if (ele.children) {
            nextlist.push(ele.children)

            fileTree += ">[" + ele.fname + "]" + "(" + "/" + ele.name + "/)" + "\n>\n";

        } else {

            fileTree += ">[" + ele.fname + "]" + "(" + "/" + ele.name + ")" + "\n>\n";

        }
    });
    console.log(filepath);
    addlist(filepath, fileTree)
    nextlist.forEach(ele => {
        write(ele)
    });


}
write(dirTree)