const path = require("path")
const fs = require("fs");

/**
 * 离线化接口
 */
module.exports = {
    folders: {
        describe: "获取本地文件夹列表",
        method: "get",
        params: {
            folderName: "/",
        },
        before: (params, utils, plugin) => {
            return params
        },
        after: async function (data, params, utils, plugin,) {
            let basePath = "D:/cxy/project/self/easyStaticService/service/public/static";
            const folders = []; // 文件夹列表
            let resources = null; // 资源列表
            try {
                basePath = path.join(basePath, params.folderName)
                resources = fs.readdirSync(basePath);
            } catch (e) {
                console.log("路径错误，请重新传参：", e)
            }
            resources.forEach(i => {
                const filePath = path.join(basePath, i);
                let isFolder = null;
                try {
                    isFolder = fs.statSync(filePath).isDirectory();
                } catch (e) {
                    // 不是文件夹...
                }
                isFolder ? folders.push(i) : "";
            });
            return folders
        }
    },
    files: {
        describe: "获取本地列表",
        method: "get",
        params: {
            folderName: "/",
        },
        after: async function (data, params, utils, plugin,) {
            const analysisFileStringInfo = (filename) => {
                const pattern = /(.*)\.(\w+)$/;
                const result = filename.match(pattern);
                if (result) {
                    return {
                        fileName: result[1],
                        fileExtension: result[2]
                    };
                } else {
                    return {
                        fileName: '',
                        fileExtension: ''
                    };
                }
            };

            let basePath = "D:/cxy/project/self/easyStaticService/service/public/static";
            const files = []; // 文件夹列表
            let resources = null; // 资源列表
            try {
                basePath = path.join(basePath, params.folderName)
                resources = fs.readdirSync(basePath);
            } catch (e) {
                console.log("路径错误，请重新传参：", e)
            }
            resources.forEach(i => {
                const filePath = path.join(basePath, i);
                let isFolder = null;
                try {
                    isFolder = fs.statSync(filePath).isDirectory();
                } catch (e) {
                    // 不是文件夹...
                }
                isFolder ? "" : files.push({
                    fileUrl: path.join(basePath, i),
                    fileIpUrl: "http://192.168.1.137:8689/" + path.join(params.folderName, i),
                    ...analysisFileStringInfo(i)
                });
            });
            return files
        }
    },
    createFolder: {
        describe: "创建本地文件夹",
        method: "get",
        params: {
            folderName: "/",
        },
        after: async function (data, params, utils, plugin,) {
            let basePath = "D:/cxy/project/self/easyStaticService/service/public/static/";
            const folderPath = path.join(basePath, params.folderName);
            if (fs.existsSync(folderPath)) {
                return { code: 500, msg: "文件已经存在", data: null }
            }
            try {
                fs.mkdirSync(folderPath);
                return { code: 200, msg: "文件夹创建成功", data: null };
            } catch (err) {
                return { code: 500, msg: "文件夹创建失败", data: err };
            }
        }
    },
    uploadImg: {
        describe: "上传图片",
        method: "post",
        uploadImgPath: "/public/static",
        params: {
            folderName: "",
        },
        after: async function (data, params, utils, plugin,) {
            this.files.forEach((file, index) => {
                fs.renameSync(
                    file.path,
                    path.join(process.cwd(), `/public/static${params.folderName}`, `${Date.now()}-$${utils.$String.createUUid(10)}-${path.extname(file.originalname)}`)
                );
            });
            return { code: 200, msg: "文件上传完成", data: null }
        }
    }
};
