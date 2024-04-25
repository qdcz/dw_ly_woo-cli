/**
 * 注册用户
 */
module.exports = {
    register: {
        describe: "注册用户",
        method: "get",
        dataSourceName: "woo",
        /**
         * account {string}
         * password {string}
         * phone {number}
         */
        params: {
            account: "",
            password: "",
            phone: ""
        },
        before: (params, utils, plugin) => {
            // if (!params.account || !params.password) {
            //     throw Error("账号密码不能为空！")
            // }
            return params
        },
        after: async function (data,) {
            const driver = await this.getCurrentDataSource();
            console.log(666, driver)
            return 666
        }
    }
};
