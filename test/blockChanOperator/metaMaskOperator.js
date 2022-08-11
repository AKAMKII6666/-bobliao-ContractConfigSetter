//大数字计算库
var _bigNumber = require("bignumber.js");
/**
 * 廖力编写 2021年08月13号
 * metaMask智能合约操作器
 * 用于使用window.ethereum来操作智能合约的模块
 * 文档及使用说明:http://192.168.5.201:8181/docs/react_4jnet/react_4jnet-1d6ho95ser744
 */
const _metaMaskOperator = function () {
	
		var self = this;

		//避免服务器端渲染找不到window并报错
		try {
			if (typeof window !== "undefined") {
				//判断是否安装了metaMask
				if (typeof window.ethereum === "undefined") {
					this.noBase = true;
				} else {
					this.noBase = false;
				}

				//环境变量，通过它来判要使用正式版的智能合约还是测试版的
				this.projEvn = process.env.NODE_ENV;
				if (this.projEvn === "development") {
					//简写环境变量
					this.projEvn = "dev";
				} else {
					//简写环境变量
					this.projEvn = "pro";
				}

				//在这里接入用户管理对象
				this.userAccount = window.common.userAccount;

				//当前网络id
				this.currentNetwork = "";

				//当前用户
				//这个地方的用户已经在./src/Header.js里取好了，所以只需要读取本地用户就行了
				this.currentAccount = this.userAccount.currentAccount;

				//是否登陆
				this.hasLogin = false;

				if (this.currentAccount !== "") {
					this.hasLogin = true;
				}

				//当账号被修改就重新绑定账号信息
				window.common.userAccount.onAccountChange(function (_accont) {
					if (_accont === "") {
						self.hasLogin = false;
						self.currentAccount = "";
						return;
					}
					self.hasLogin = true;
					self.currentAccount = _accont;
				});

				if (typeof window.ethereum !== "undefined") {
					window.ethereum.request({ method: "eth_chainId" }).then(function (_res) {
						self.currentNetwork = Number(_res);
					});
					this.aT = null;
					window.ethereum.on("chainChanged", function (_str) {
						self.currentNetwork = Number(_str);
						if (this.aT !== null) {
							window.clearTimeout(this.aT);
						}
						this.aT = setTimeout(() => {
							self.userAccount.whenAccountChange();
						}, 1000);
					});
					let aT2 = null;
					window.ethereum.on("networkChanged", function (_str) {
						if (this.aT !== null) {
							window.clearTimeout(this.aT);
						}
						this.aT = setTimeout(() => {
							self.userAccount.whenAccountChange();
						}, 1000);
					});
				}
			}
		} catch (_e) {}

		//智能合约配置文件
		this.contractConfig = false;

		//操作器合集
		this.operator = false;

		/**
		 * 批量调起合约
		 * @param {Array} _arr 调用函数集
		 * @param {Function} _callback 完成的回调函数
		 */
		this.mutilRequest = function (_arr, _callback) {
			if (this.noBase === true && this.userAccount === "") {
				return;
			}
			//完成函数
			var count = _arr.length;
			var complete = function (_result, _type, _index) {
				count--;
				_arr[_index].result = {
					type: _type,
					result: _result,
				};
				if (count === 0) {
					var resArr = [];
					for (var i = 0; i < _arr.length; i++) {
						resArr.push(_arr[i].result);
					}
					_callback.apply(this, resArr);
				}
			};

			//调起智能合约
			var makeRequest = function (_func, _index) {
				_func()
					.then(function (_res) {
						complete(_res, "success", _index);
					})
					.catch(function (_res) {
						complete(_res, "error", _index);
					});
			};

			for (var i = 0; i < _arr.length; i++) {
				makeRequest(_arr[i], i);
			}
		};

		/**
		 * 探测钱包的状态
		 * @param {Function} _noMetamaskCall 没有安装回调
		 * @param {Function} _noLoginCall 没有登陆回调
		 * @param {Function} _keepCall 检测通过回调
		 */
		this.detactMMState = function (_noMetamaskCall, _noLoginCall, _keepCall) {
			//没有安装metaMask
			if (this.noBase === true) {
				_noMetamaskCall();
				return;
			}
			//如果没有登陆
			if (this.hasLogin === false) {
				_noLoginCall();
				return;
			}
			_keepCall();
		};

		/**
		 * 探测钱包当前网络是否为合约所需网络
		 */
		this.detactNetWork = function () {
			if (self.contractConfig === false) {
				console.log("请先载入合约配置文件..并将目标合约传入到to中");
				return;
			}

			if (self.currentNetwork !== self.contractConfig.info.depChainId) {
				return false;
			}

			return true;
		};

		/**
		 * 用于唤起用户登陆
		 * @param {Function} _callBack metamesk登陆之后调用这个函数
		 */
		this.loginMetaMask = function (_callBack) {
			if (window.ethereum) {
				window.ethereum.request({
					method: "eth_requestAccounts",
				});
				window.ethereum.on("accountsChanged", function (accounts) {
					//使用全局更改账号的模块更改账号
					self.userAccount.setAccount(accounts[0]);
					_callBack(accounts);
				});
			}
		};

		/**
		 * 用于唤起用户安装MetaMesk
		 */
		this.onBoard = function () {
			//异步加载用户登陆组件
			/**
			 * 用于检测用户是否登陆了metamesk的组件
			 * 文档:
			 * https://www.npmjs.com/package/@metamask/onboarding
			 */
			require(["@metamask/onboarding"], function (_metaMaskOnboarding) {
				let onboarding = new _metaMaskOnboarding.default();
				onboarding.startOnboarding();
			});
		};

		/**
		 * 检查是否有MetaMesk
		 * @param {Function} _callBack 没有MetaMesk就会调用这个回调函数
		 */
		this.checkNoBase = function (_callBack) {
			if (this.noBase === true) {
				_callBack();
			}
		};

		/**
		 * 获取签名器和节点提供器
		 * @param {Function} _callBack 取得操作器的回调函数
		 * @returns {undefined}
		 */
		this.makeOperator = function (_callBack) {
			if (this.noBase === true && this.userAccount === "") {
				return;
			}
			//做一个缓存,如果都加载好了就不要再加载了
			if (this.operator !== false) {
				_callBack(self.operator);
				return;
			}
			//异步加载ethersjs
			require(["ethers", "web3-eth-contract"], function (_ethers, _web3Contract) {
				//载入的provider就不是节点了,是metaMesk
				_web3Contract.setProvider(window.ethereum);
				//通过MetaMask获得provider
				var provider = new _ethers.providers.Web3Provider(window.ethereum);
				//获得签名器
				var signer = provider.getSigner();
				self.operator = {
					signer: signer,
					provider: provider,
					web3Contract: _web3Contract,
				};
				_callBack(self.operator);
			});
		};

		/**
		 * 解析合约
		 * 将合约从合约配置文件中取出来,
		 * 并将abi文件读取出来然后,
		 * 将合约中的操作方法注入到本操作器中
		 * @param {Object} _contractConfig 智能合约对象 文档地址:http://192.168.5.201:8181/docs/react_4jnet/react_4jnet-1d6jbb32nslj4
		 * @param {Function} _callback 解析完成后的回调函数
		 * @returns {Promise}   reslove(_web3Operator)
		 */
		this.initContract = function (_contractConfig, _callback) {
			if (this.noBase === true && this.userAccount === "") {
				return;
			}
			//初始化
			let init = function (_reslove, _callback) {
				//已经载入过这份合约配置了就直接返回结果了
				if (self.contractConfig === _contractConfig[self.projEvn]) {
					_callback(self);
					_reslove(self);
					return;
				}
				self.contractConfig = _contractConfig[self.projEvn];
				var totalCount = 0;
				var cCount = 0;
				//用于abi文件加载计数的函数
				var completed = function () {
					cCount++;
					if (cCount === totalCount && typeof _callback !== "undefined") {
						_callback(self);
					}
					if (cCount === totalCount) {
						_reslove(self);
					}
				};
				for (var i in self.contractConfig) {
					if (i !== "info") {
						(function (_item, _i) {
							let item = _item;
							//这里异步加载abi文件
							item.getAbiAsync(function (_abi) {
								//异步加载智能合约模块
								//不用担心循环里重复require多次,webpack会缓存第一次require的结果,之后就都是从本地缓存里拿.
								self.makeOperator(function (_operator) {
									//拉取到合约abi文件后,初始化合约
									self[_i] = new _operator.web3Contract(_abi, item.id);
									//每完成一个合约的初始化,就在这里计数
									completed();
								});
							});
						})(self.contractConfig[i], i);
						totalCount++;
					}
				}
			};

			let p = new Promise(function (_reslove) {
				init(_reslove, _callback);
			});

			return p;
		};

	/**
	 * 获得用户余额
	 * @param {回调函数(用户余额)} _callBack
	 * @returns {number} Promis.reslove( 用户余额 )
	 */
	this.getUserBalance = function (_callBack) {
		if (this.noBase === true && this.userAccount === "") {
			return;
		}
		var p = new Promise(function (_reslove) {
			//获取签名器
			self.makeOperator(function (_operator) {
				//直接使用签名器获得用户的余额
				_operator.signer
					.getBalance()
					.then(function (_res) {
						return _res;
					})
					.then(function (_res) {
						//获得余额以后返回
						var result = Number(_ethers.utils.formatEther(_res._hex));
						if (typeof _callBack !== "undefined") {
							_callBack(result);
						}
						_reslove(result);
					});
			});
		});
		return p;
	};

	/**
	 * 处理交易发起后的回调函数
	 * @param {promise} _promise
	 * @param {{to:string,amont:number,success:function,rejected:function,error:function}} _config to:'目标账户id/合约id',amont:'发送的eth数量',success:callBack()//成功,rejected:callBack()//被用户取消,error:callBack()//出现错误,
	 * @param {function} _reslove
	 * @param {function} _rejected
	 */
	this.returnHandler = function (_promise, _config, _reslove, _rejected) {
		if (this.noBase === true && this.userAccount === "") {
			return;
		}
		_promise
			.then(
				function (_res) {
					if (typeof _config.success !== "undefined") {
						_config.success(_res);
					}
					_reslove(_res);
				},
				function (_res) {
					if (typeof _config.rejected !== "undefined") {
						_config.rejected(_res);
					}
					_rejected(_res);
				}
			)
			.catch(function (_e) {
				if (typeof _config.error !== "undefined") {
					_config.error(_e);
				}
				throw _e;
			});
	};

	/**
	 * 通过当前账号发起对(用户/合约)转账
	 * @param {{to:string,amont:number,success:function,rejected:function,error:function}} _config to:'目标账户id/合约id',amont:'发送的eth数量',success:callBack()//成功,rejected:callBack()//被用户取消,error:callBack()//出现错误,
	 * @returns {promise}
	 */
	this.sendEthWithAccount = function (_config) {
		if (this.noBase === true && this.userAccount === "") {
			return;
		}
		var p = new Promise(function (_reslove, _rejected) {
			//获取签名器
			self.makeOperator(function (_operator) {
				var promise = _operator.provider.send("eth_sendTransaction", [
					{
						//从自己账号里转
						from: self.currentAccount,
						//转去人的地址
						to: _config.to,
						//转多少eth
						value: _ethers.utils.parseUnits(_config.amont.toString(), "ether").toHexString(),
					},
				]);
				//交给回发处理器去处理了
				self.returnHandler(promise, _config, _reslove, _rejected);
			});
		});

		return p;
	};

	/**
	 * 通过当前账号发起对合约转账
	 * @param {{to:object,amont:number,success:function,rejected:function,error:function}} _config to:'一个从操作器里取出来的合约对象',amont:'发送的eth数量',success:callBack()//成功,rejected:callBack()//被用户取消,error:callBack()//出现错误,
	 * @returns {promise}
	 */
	this.transEthWithAccountToContract = function (_config) {
		if (this.noBase === true && this.userAccount === "") {
			return;
		}
		var p = new Promise(function (_reslove, _rejected) {
			if (self.contractConfig === false) {
				console.log("请先载入合约配置文件..并将目标合约传入到to中");
				return;
			}
			//获取签名器
			self.makeOperator(function (_operator) {
				var promise = _operator.provider.send("eth_sendTransaction", [
					{
						//从自己账号里转
						from: self.currentAccount,
						//转去人的地址
						to: _config.to._address,
						//转多少eth
						value: _ethers.utils.parseUnits(_config.amont.toString(), "ether").toHexString(),
					},
				]);
				//交给回发处理器去处理了
				self.returnHandler(promise, _config, _reslove, _rejected);
			});
		});

		return p;
	};

	/**
	 * 将大数字类型转成decimal的方法(eth_18)
	 * @param {Number} _num 传入一个数字
	 */
	this.ethToDecimal = function (_num) {
		//18位
		return _num / 10 ** 18;
	};
	this.decimalToEth = function (_num) {
		//18位
		return _num * 10 ** 18;
	};
	this.fjnetToDecimal = function (_num) {
		//9位
		return _num / 10 ** 9;
	};
	this.decimalTo4jnet = function (_num) {
		//9位
		return _num * 10 ** 9;
	};

	/**
	 * 使用大数字库对值进行转换
	 */
	this.bigNumComp = {
		ethToDecimal: function (_num) {
			//18位 _num / 10 ** 18
			return new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(18).toFixed()).toFixed();
		},
		decimalToEth: function (_num) {
			//18位 _num * 10 ** 18;
			return new _bigNumber(_num).multipliedBy(new _bigNumber(10).exponentiatedBy(18).toFixed());
		},
		fjnetToDecimal: function (_num) {
			//9位 _num / 10 ** 9;
			return new _bigNumber(_num).dividedBy(new _bigNumber(10).exponentiatedBy(9).toFixed()).toFixed();
		},
		decimalTo4jnet: function (_num) {
			//9位 _num * 10 ** 9;
			return new _bigNumber(_num).multipliedBy(new _bigNumber(10).exponentiatedBy(9).toFixed());
		},
	};

	/**
	 * http请求方法
	 * @param {String} _url 传入要请求的url
	 * @param {Function} _callBack 回调函数
	 */
	this.get = function (_url, _callBack) {
		if (this.noBase === true && this.userAccount === "") {
			return;
		}
		fetch(_url, { method: "GET" })
			.then(function (_res) {
				return _res.json();
			})
			.then(function (_res) {
				if (typeof _callBack !== "undefined") {
					_callBack(_res);
				}
			});
	};
};

export { _metaMaskOperator };
