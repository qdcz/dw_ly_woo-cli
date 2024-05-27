/**
 * 测试文件
 */

const global = require("../config/global",);
module.exports = {
    example00: {
        describe: "没有任何数据源的一个接口",
        method: "get",
        after: () => {
            return [
                {
                    name: "我是一条mock数据",
                    value: "999",
                },
            ];
        },
    },
    example01: {
        describe: "测试sql 注入攻击, 知道你的name 不知道你的value。直接忽略",
        method: "get",
        params: {
            name: "'福建省' or '1' = '1'",
            value: "999",
        },
        dataSourceName: "self-test-mysql",
        sql: `
            SELECT * from aaa_lt_chsj_sjff where name =:name and value =:value
        `,
    },
    example02: {
        describe: "测试sql 注入攻击, 知道你的name 不知道你的value。直接忽略",
        method: "get",
        params: {
            name: "'福建省' --",
            value: "999",
        },
        dataSourceName: "self-test-mysql",
        sql: `
            SELECT * from aaa_lt_chsj_sjff where name =:name and value =:value
        `,
    },
    example03: {
        describe: "同时使用sql、proxyAPI 和 plugin",
        method: "get",
        params: {
            buyer_name: "辽宁大唐国际昌图风电有限责任公司",
        },
        dataSourceName: "self-test-mysql",
        // database 专用字段
        sql: `
            select * from image
        `,
        // proxyApi 专用字段
        proxyAPI: {
            target: "http://81.69.20.73:5400/Snxun/Visix/DaTang/test/cgjdxxzb",
            method: "post",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        },
        // 静态数据专用字段
        static: {},
        plugins: ["gs001",],
        before: async (params, utils, plugin,) => {
            const res = await plugin[0].login();
            return {
                params,
                headers: {
                    "authorization": "Bearer " + res.data.data.token,
                    "x-token": "Bearer " + res.data.data.token,
                },
            };
        },
        after: (data, utils, plugin,) => {
            return data;
        },
    },
    example04: {
        describe: "使用全局变量",
        method: "get",
        after: (data, utils, plugin,) => {
            console.log("使用全局变量", global,);
            return data;
        },
    },
    example05: {
        describe: "测试mongodb数据源",
        dataSourceName: "self-test-mongodb",
        method: "get",
        after: async function (data, params, utils, plugin,) {
            // 获取当前的mongodb数据库实例
            const driver = await this.getCurrentDataSource();

            // 插入一条或者多条数据
            // let insertData = await driver.insertOne("test", {
            //     name: "test",
            //     time: Date.now()
            // });

            // 插入一条数据，如果数据库中存在则返回失败
            // let insertDataAndCheck = await driver.insertOneAndCheck("test", {
            //     name: "test",
            //     time: Date.now()
            // });

            // 插入一条或者多条数据
            // let insertData1 = await driver.insertMany("test", [
            //     {
            //         name: "test1",
            //         time: Date.now()
            //     },
            //     {
            //         name: "test2",
            //         time: Date.now()
            //     }
            // ])

            // 简单查询 查询loggers文档下的所有数据
            // let findData = await driver.find("loggers", {})

            // 简单条件查询 查询loggers文档下的 requestUrl 字段为 /favicon.ico 的数据
            // let findData1 = await driver.find("loggers", {
            //     requestUrl: "/favicon.ico"
            // })

            // 删除一条数据
            // let deleteOneData = await driver.deleteOne("test", {
            //     data:"666666666666666666666"
            // })

            //  删除多条数据
            // let deleteOneData = await driver.deleteMany("test", {
            //     data: { $regex: "Santa" }
            // })


            // 获取数量文档的数量 estimatedDocumentCount 更快，只扫描元数据
            // let getCountData = await driver.estimatedDocumentCount("test");
            // 获取数量文档的数量 countDocuments 更慢，扫描集合，支持复杂过滤器
            // let getCountData1 = await driver.countDocuments("loggers");
            // let getCountData2 = await driver.countDocuments("loggers", {
            //     responseTime: { "$gt": 100, "$lt": 200 }
            // });


            // 查询该文档下的所有数据并以time字段呈现，重复的time值自动去重。
            // let findData2 = await driver.distinct("test", "time", {})

            // 复杂用法：对一个文档同时进行增删改查
            // await driver.bulkWrite([{
            //     insertOne: {
            //         document: {
            //             location: {
            //                 address: {
            //                     street1: "3 Main St.",
            //                     city: "Anchorage",
            //                     state: "AK",
            //                     zipcode: "99501",
            //                 },
            //             },
            //         },
            //     },
            // },
            // {
            //     insertOne: {
            //         document: {
            //             location: {
            //                 address: {
            //                     street1: "75 Penn Plaza",
            //                     city: "New York",
            //                     state: "NY",
            //                     zipcode: "10001",
            //                 },
            //             },
            //         },
            //     },
            // },
            // {
            //     // Update documents that match the specified filter
            //     updateMany: {
            //         filter: { "location.address.zipcode": "44011" },
            //         update: { $set: { is_in_ohio: true } },
            //         upsert: true,
            //     },
            // },
            // {
            //     // Delete a document that matches the specified filter
            //     deleteOne: { filter: { "location.address.street1": "221b Baker St" } },
            // },
            // ], {});
            return "default data"
        },
        uploadImg: {
            describe: "上传图片",
            method: "post",
            uploadImgPath: "/public/uploads",
            params: {
                uploadPath: "/",
            },
            after: async function (data, params, utils, plugin,) {
                this.files.forEach((file, index) => {
                    fs.renameSync(
                        file.path,
                        path.join(process.cwd(), '/public/uploads', `${Date.now()}-$${utils.$String.createUUid(10)}-${path.extname(file.originalname)}`)
                    );
                });
                return { code: 200, msg: "文件上传完成", data: null }
            }
        }
    },
};
