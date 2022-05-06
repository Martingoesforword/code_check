//从githook获取提交记录

var process = require('process');
var cmd=require('node-cmd');
var fs= require("fs");
var ret = cmd.runSync('git diff --cached --name-only');
var changeFiles = ret.data.split("\n");
// 从提交记录获取变动文件列表
var errors = [];
var warrings = [];

// 可配置过滤器组合：向过滤器传入参数
var filterConfig = {
    "==使用警告": 1,
    "todo未做内容警告": 1,
};

//定义过滤器
var filters = {
    "==使用警告": {
        fileType: function (type) {
            if({"cpp": 1,
                "c": 1,
                "hpp": 1,
                "h": 1,
                "cc": 1,
                "js": 1,
                "ts": 1,
            }[type]) {
                return 1;
            }
        },
        warringDesc: function (fileInfo) {
            var fileName = fileInfo["fileName"];
            return fileName+" is warring in ==可能用作赋值语句";
        },
        warringMatch: function (fileContent) {
            if(fileContent.match(/==/)) {
                return true;
            }
        }
    },
    "todo未做内容警告": {
        fileType: function (type) {
            if({"cpp": 1,
                "c": 1,
                "hpp": 1,
                "h": 1,
                "cc": 1,
                "js": 1,
                "ts": 1,
            }[type]) {
                return 1;
            }
        },
        warringDesc: function (fileInfo) {
            var fileName = fileInfo["fileName"];
            return fileName+" is warring in todo未做内容警告";
        },
        warringMatch: function (fileContent) {
            if(fileContent.match(/todo:/)) {
                return true;
            }
        }
    }
};


// 对某种文件名，文件大小等信息实现自定义劫持操作，或者通用劫持操作
changeFiles.forEach((filePath)=>{
    if(!filePath.length) return;
    var fileContent = fs.readFileSync(filePath, {encoding:"utf8"});
    var filetype = "";
    for (let i = filePath.length-1; i >= 0 ; i--) {
        if(filePath[i] === '.') {
            break;
        }
        else {
            filetype = filePath[i]+filetype;
        }
    }
    for (let filtersKey in filters) {
        //过滤配置
        if(!filterConfig[filtersKey]) {
            continue;
        }
        var filter = filters[filtersKey];

        //筛选文件类型
        if(filter.fileType(filetype)) {
            if(filter.errorMatch && filter.errorMatch(fileContent)) {
                errors.push(filter.errorDesc({fileName:filePath}));
            }
            if(filter.warringMatch && filter.warringMatch(fileContent)) {
                errors.push(filter.warringDesc({fileName:filePath}));
            }
        }
    }
})

// 对每种劫持操作实现一个 正则map，遍历map进行正则匹配，对不同结果调用map中的desc，type等字段进行组合，产生用户提示信息列表


if(errors.length || warrings.length) {
    // 输出信息列表
    console.log("warrings: \n" + JSON.stringify(warrings))
    console.log("errors: \n" + JSON.stringify(errors))
    process.exit(-1);
}
else {
    process.exit(0);
}
