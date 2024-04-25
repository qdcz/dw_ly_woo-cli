# quickAPI

**介绍** : 旨在为用户提供快速便捷的创建接口流程。

**特点**: 敏捷开发高性能接口，拓展性极强，支持插件开发、自定义使用依赖、支持离线部署、支持程序绑定设备物理地址、内置接入数据库源种类极多开箱即用，支持 mq、kafka 等微服务接入并便捷使用

后续会支持可视化界面，通过便捷操作编写逻辑，全自动化运维部署生成接口。

## 系统能力

### 字段介绍：app.js 配置文件

内置也有一个 app.js 文件 外部的 app.js 文件会对内置的 app.js 做覆盖操作。

### 字段介绍：路由配置文件

    先看下生成简单API 再来对照以下字段介绍

-   router001 `<Object>`：路由的二级路径名称
    -   describe `<Sting>`：该接口的描述信息
    -   method `<Sting>`：设置该接口的请求类型
    -   params `<Object>`：设置该接口接收的请求参数（get 是路径传参，post 是 body 传参）
    -   dataSourceName `<Sting>`：数据库连接名称
    -   sql `<Sting>`：sql 语句
    -   proxyAPI `<Object>`：代理第三方接口
        -   target `<Sting>`：接口地址
        -   method `<Sting>`：请求类型
        -   headers `<Object>`：请求头
    -   static `<Object>`：静态数据配置
    -   plugins `<Array>`：插件配置，注意里面的内容要跟插件的名称一致
    -   before `<Function>`：前置处理函数，一般用于前置参数处理或者插件的使用。
        -   可以是同步函数也可以是异步函数，ES5 函数写法带有 this 指针，指向当前对象，箭头函数没有 this。
        -   参数 1 是传入的 params 对象
        -   参数 2 是 utils 工具类
        -   参数 3 是引入的插件类实例
    -   after `<Function>`：后置处理函数，一般用于数据的格式处理，比如从数据库中查到的数据做处理或者代理请求的结果数据做处理。
        -   可以是同步函数也可以是异步函数，ES5 函数写法带有 this 指针，指向当前对象，箭头函数没有 this。
        -   参数 1 是传入的 data 对象
        -   参数 2 是传入的 最终结果的 params 对象
        -   参数 3 是 utils 工具类
        -   参数 4 是引入的插件类实例
-   router002 `<Object>`：路由的二级路径名称
-   router003 `<Object>`：路由的二级路径名称
-   router004 `<Object>`：路由的二级路径名称
-   router005 `<Object>`：路由的二级路径名称
-   router006 `<Object>`：路由的二级路径名称
-   router007 `<Object>`：路由的二级路径名称

### 生成简单的 API

在`public` 文件夹中新建一个名为 `test.js`的文件，然后在里面编写以下代码，然后启动程序，一个 API 接口就被成功的创建了。

```js
/** 路由文件： test.js */
module.exports = {
    cxy00: {
        describe: "个人接口00",
        method: "get",
    },
};
```

访问路径为 `IP:端口/路由前缀/test/cxy00`

由于我们没有设置返回数据所以当调用该接口时会发现返回了一个空数据。

我们可以使用 after 函数，返回出一些数据

```js
/** 路由文件： test.js */
module.exports = {
    cxy00: {
        describe: "个人接口00",
        method: "get",
    },
    after: () => {
        return [
            {
                name: "我是一条mock数据",
                value: "999",
            },
        ];
    },
};
```

同时也支持多文件嵌套的使用

比如：public/folder1/folder11/folder111/test.js

访问路径为 `IP:端口/路由前缀/folder1/folder11/folder111/test/cxy00`

### 接入数据库

目前该系统集成了 mysql、postgres 开箱即用

需要在 `app.js` 中 设置添加数据源

```js
/** app.js */
module.exports = {
    port: 8689,
    // ...
    // 数据库连接配置
    databases: [
        {
            type: "mysql",
            name: "self-test-mysql",
            host: "192.168.125.10",
            port: "6666",
            username: "root",
            password: "123456",
            database: "visix",
        },
        {
            type: "postgres",
            name: "nnnnnnnwanshujuku",
            host: "192.168.5.172",
            port: "5001",
            username: "postgres",
            password: "postgres",
            database: "visix",
        },
    ],
};
```

然后在使用接口的时候分配对应的数据源的 name 即可

```js
/** 路由文件： test.js */
module.exports = {
    cxy00: {
        describe: "个人接口00",
        method: "get",
        dataSourceName: "self-test-mysql",
        sql: `
            select * from image
        `,
    },
};
```

如果涉及到 sql 的动态参数，可以按照以下操作

```js
/** 路由文件： test.js */
module.exports = {
    cxy00: {
        describe: "动态参数配置",
        method: "get",
        params: {
            name: "'福建省'",
        },
        dataSourceName: "self-test-mysql",
        sql: `
            SELECT * from lt_chsj_sjff where name =:name
        `,
    },
};
```

### 支持数据库集群模式配置

```js
/** app.js */
const AppConfig = {
    port: 8689,
    // 数据库连接配置
    databases: [
        {
            type: "mysql",
            name: "self-test-mysql",
            host: "192.168.5.172",
            port: "6666",
            username: "root",
            password: "123456",
            database: "visix",
            // 可支持主从集群模式
            replication: {
                master: {
                    host: "master-host",
                    port: 3306,
                    username: "master-username",
                    password: "master-password",
                    database: "master-db",
                },
                slaves: [
                    {
                        host: "slave1-host",
                        port: 3306,
                        username: "slave1-username",
                        password: "slave1-password",
                        database: "slave1-db",
                    },
                    {
                        host: "slave2-host",
                        port: 3306,
                        username: "slave2-username",
                        password: "slave2-password",
                        database: "slave2-db",
                    },
                ],
            },
        },
    ]
};

```

### 使用代理第三方接口

```js
cxy00: {
        describe: "个人接口00",
        method: "get",
        params: {
            buyer_name: "前端传入的参数，没有会使用这个默认内容",
        },
        proxyAPI: {
            target: "http://192.124.120.10:5400/qd/vivi/DaTang/test/cgjdxxzb",
            method: "post",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        }
    },
```

### 使用前置函数和后置函数

```js
cxy00: {
        describe: "个人接口00",
        method: "get",
        params: {
            buyer_name: "前端传入的参数，没有会使用这个默认内容",
        },
        proxyAPI: {
            target: "http://192.124.120.10:5400/qd/vivi/DaTang/test/cgjdxxzb",
            method: "post",
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        },
        before: async (params, utils, plugin) => {
            params['x-time'] = Date.now();
            return {
                params,
                headers: {},
            };
        },
        after: (data, params, utils, plugin) => {
            return data.map(i=>{
                i.name = "数据处理";
                return i
            })
        },
    },
```

### 在前后置函数中加载静态资源文件

```js
module.exports = {
    kt: {
        describe: "空调设备点位",
        method: "get",
        params: {
            /**
             * building  1号楼(B)  2号楼(A)
             * floor  楼层  1层 10层  负1层
             */
            building: "",
            floor: "",
            manufacturerId: "Daikinkongtiao",
            model: "V2.0",
            isMock: false,
        },
        proxyAPI: {
            target: "http://192.168.1.156:8081/visualization/sbtc/sbcx",
            method: "get",
        },
        after: async function(data, params, utils,) {
             if (!params.isMock) {
                 return data
             }else{
                 return await utils.readLocalValue("public/static/mock/kt.json",);
             }
        }
    }
}
```



### 使用插件

该系统的插件分为两部分 一部分是路由的插件 一部分是平台的插件能在整个生命周期做一些事情

#### 路由的插件

比如在接口配置文件中需要代理 第三方的接口，但是第三方的接口调用需要先鉴权，这个时候就能使用路由插件来满足这个要求

在 `plugin` 文件中新建一个 `gs001.js` 文件，然后编写一些登录的逻辑的调用

```js
/** gs001.js    001公司的登录鉴权接口 */
module.exports = class gs001 {
    constructor(app) {
        this.app = app;
        this.config = {
            aliveTime: 1000 * 60 * 30,
        };
        this.cache = {
            requestTime: undefined,
            data: undefined,
        };
    }
    async login() {
        if (
            !this.cache.requestTime ||
            Date.now() - this.cache.requestTime > this.config.aliveTime
        ) {
            this.cache.requestTime = Date.now();
            await this.api_request();
        }
        return this.cache.data;
    }
    /**
     * 登录接口请求
     */
    async api_request() {
        const axios = this.app.utils.$axios;
        const data = await new Promise((res) => {
            axios({
                method: "post",
                url: "http://192.168.122.45:5400/qd/vivi/auth/login",
                data: {
                    username: "admin",
                    password: "123456a",
                },
                headers: {
                    "content-type": "application/json",
                },
            })
                .then((r) => {
                    if (r.status == 200) {
                        res({ code: 200, data: r.data });
                    } else {
                        res({
                            status: r.status,
                            statusText: r.statusText,
                            headers: r.headers,
                            config: r.config,
                            data: r.data,
                        });
                    }
                })
                .catch((e) => {
                    console.log("error", e);
                    res(e);
                });
        });
        this.cache.data = data;
    }
};
```

编写完插件之后，在路由文件中去使用插件

```js
/** 路由文件： test.js */
module.exports = {
    cxy00: {
        describe: "个人接口00",
        method: "get",
    },
    proxyAPI: {
        target: "http://192.168.122.45:5400/qd/vivi/DaTang/test/cgjdxxzb",
        method: "post",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    },
    plugins: ["gs001"],
    before: async (params, utils, plugin) => {
        const res = await plugin[0].login();
        return {
            params,
            headers: {
                authorization: "Bearer " + res.data.data.token,
                "x-token": "Bearer " + res.data.data.token,
            },
        };
    },
};
```

我们在 plugins 引入我们之前写好的插件，然后在 before 函数中的第三个参数能拿到我们的插件实例，调用下登录接口，将 token 附带到 header 中,这样接口在请求的时候会默认会附带上请求头

#### 平台的插件

### 使用静态资源服务

本服务在启动的时候默认会解析本地的资源文件。资源文件能被解析到的前提是必须放在 `public/static` 目录下

如：我在 `public/static` 目录下创建了一个名为 mock 的 文件夹，然后在mock文件夹内放置一个test.json文件

如果要在游览器能访问到这个资源文件，访问路径为 `IP:端口/路由前缀/mock/test.json`

### 服务打包



## 平台自带能力

### 程序加密狗

根据机器码和激活密钥做校验，成功才可使用，激活密码可支持永久授权和指定有效期授权。

### 日志

带有系统日志、接口日志、数据库操作日志

日志文件可无缝对接 该产品的 `日志管理系统` 将日志导入即可对其进行查看和分析。

配置文件支持直接配置 `日志管理系统` 的地址。实现实时同步。

### 插件拓展

### sql注入攻击检测

---

## 防护措施

在做 sql 生成 api 接口的时候需要考虑 sql 注入攻击问题

注入攻击的原理？

```sql
-- 传入数据库中的原始的sql语句
SELECT * from aaa_lt_chsj_sjff where name = '福建省' and value = "41880000"
-- 暴露给用户传参的就是name属性和value属性 一般来说会是这样的形式：
SELECT * from aaa_lt_chsj_sjff where name =:name and value =:value
-- 如果在没有做注入攻击的情况下，我们仔细分析，可以直接用注释的方式将value的匹配规则给消掉。  比如 name 的值为 '福建省' -- '  这样就会后面的查询条件给消掉了。
SELECT * from aaa_lt_chsj_sjff where name = '福建省' -- ' and value = '999'
-- 或者使用 or "1=1" 的方法进行后续条件的过滤
SELECT * from aaa_lt_chsj_sjff where name = "福建省' OR '1'='1'" and value = '999'
```

防止注入攻击的措施：

1. 使用参数化查询，然后如上所诉对参数字段进行敏感词判断。

2.

## 其他

计划加入rtsp推流服务。

rtsp的依赖包期望自动依赖注入。