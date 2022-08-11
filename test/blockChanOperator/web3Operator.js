/**
 * 廖力编写 2021年8月12号
 * 4jnet的web3操作器，主要用于对合约进行查询操作
 * 文档及使用说明:http://192.168.5.201:8181/docs/react_4jnet/react_4jnet-1d6hnsclqbao8
 */
let _web3Operator = function () {
    var self = this;

    //环境变量，通过它来判要使用正式版的智能合约还是测试版的
    this.projEvn = process.env.NODE_ENV;
    if (this.projEvn === 'development') {
        //简写环境变量
        this.projEvn = 'dev';
    } else {
        //简写环境变量
        this.projEvn = 'pro';
    }

    //当前用户
    //这个地方的用户已经在./src/Header.js里取好了，所以只需要读取本地用户就行了
    this.currentAccount = window.common.userAccount.currentAccount;

    //当账号被修改就重新绑定账号信息
    window.common.userAccount.onAccountChange(function (_accont) {
        self.currentAccount = _accont;
    });

    //智能合约配置文件
    this.contractConfig = {};

    /**
     * 解析合约
     * 将合约从合约配置文件中取出来,
     * 并将abi文件读取出来然后,
     * 将合约中的操作方法注入到本操作器中
     * @param {智能合约对象 文档地址:http://192.168.5.201:8181/docs/react_4jnet/react_4jnet-1d6jbb32nslj4}} _contractConfig 
     * @param {解析完成后的回调函数}} _callback 
     * @returns Promise   reslove(_web3Operator)
     */
    this.initContract = function (_contractConfig, _callback) {
        this.contractConfig = _contractConfig[this.projEvn];
        var p = new Promise(function (_reslove) {
            var totalCount = 0;
            var cCount = 0;
            //用于abi文件加载计数的函数
            var completed = function () {
                cCount++;
                if (cCount === totalCount && typeof _callback !== 'undefined') {
                    _callback(self);
                }
                if (cCount === totalCount) {
                    _reslove(self);
                }
            }
            for (var i in self.contractConfig) {
                if (i !== "info") {
					(function (_item, _i) {
						let item = _item;
						//这里异步加载abi文件
						item.getAbiAsync(function (_abi) {
							//异步加载智能合约模块
							require(["web3-eth-contract"], function (_web3Contract) {
								_web3Contract.setProvider(item.provider);
								//拉取到合约abi文件后,初始化合约
								self[_i] = new _web3Contract(_abi, item.id);
								//每完成一个合约的初始化,就在这里计数
								completed();
							});
						});
					})(self.contractConfig[i], i);
					totalCount++;
				}
            }
        });

        return p;
    }

}

export { _web3Operator };