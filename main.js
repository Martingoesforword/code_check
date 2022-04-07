//从githook获取提交记录

var process = require('process');
var cmd=require('node-cmd');
var ret = cmd.runSync('git diff --cached --name-only');
var changeFiles = ret.data.split("\n");
// 从提交记录获取变动文件列表
var errors = [];
var warrings = [];

// 可配置过滤器组合：向过滤器传入参数

// 对某种文件名，文件大小等信息实现自定义劫持操作，或者通用劫持操作
// fileName.match() 和 customMatch(fileInfo)


// 对每种劫持操作实现一个 正则map，遍历map进行正则匹配，对不同结果调用map中的desc，type等字段进行组合，产生用户提示信息列表



// 输出信息列表


if(errors.length || warrings.length) {
    process.exit(-1);
}
else {
    process.exit(0);
}
