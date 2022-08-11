/**
 * 廖力编写 2021/10/14
 *
 */
var fs = require("fs");
var prettier = require("prettier");
const elec = require("electron");

const _index = function () {
	var self = this;

	self.console = new liConsole({
		parent: self,
	});

	//mvvm对象
	this.mvvm = null;

	//用于向bsc拉取abi时的cookie伪造信息
	//this.fakeCookie = "_ga_6VL823NXX0=GS1.1.1650441585.7.1.1650441791.0; _ga=GA1.1.663166101.1650441785; ASP.NET_SessionId=enrhtp3b4k1secfg3cmofkzk";
	this.fakeCookie = "";

	//当前数据
	this.data = {
		abiPath: "",
		configPath: "",
		projectPath: "",
		configFileList: [],
		abiFileList: [],
		fileList_configs: [],
		fileList_abis: [],
		configs: {
			pro: [],
			dev: [],
		},
		deps: {
			dev: {
				depChainId: "",
				depChainName: "",
				depChainNode: "",
				depChainfix: "",
				depSymbol: "",
				depVisitUrl: "",
				depDecimals: "",
			},
			pro: {
				depChainId: "",
				depChainName: "",
				depChainNode: "",
				depChainfix: "",
				depSymbol: "",
				depVisitUrl: "",
				depDecimals: "",
			},
		},
		isShowSPage: false,
		isShowCCMain: false,
	};

	/**
	 * 增加配置时用的数据
	 */
	this.addingData = {
		filename: "DefaultName",
		path: "",
		dev: {
			info: {
				depChainId: 0,
				depChainName: "请在此填写依赖的链名称",
				provider: "https://data-seed-prebsc-1-s1.binance.org:8545/",
				abiOnlineLinkTemp:
					"https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=[{HASH}]&format=raw",
				//web3链接节点的符号
				symbol: "请填写符号,不可为空",
				//查询浏览器的访问地址
				visitUrl: "请填写查询访问地址,例如 https://bscscan.com/",
				//小数位数
				decimals: "请填写此链所使用币种的小数位数",
			},
			cConfigs: [
				{
					name: "",
					value: {
						//合约id
						id: "",
					},
				},
			],
		},
		pro: {
			info: {
				depChainId: 0,
				depChainName: "请在此填写依赖的链名称",
				provider: "https://data-seed-prebsc-1-s1.binance.org:8545/",
				abiOnlineLinkTemp:
					"https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=[{HASH}]&format=raw",
				//web3链接节点的符号
				symbol: "请填写符号,不可为空",
				//查询浏览器的访问地址
				visitUrl: "请填写查询访问地址,例如 https://bscscan.com/",
				//小数位数
				decimals: "请填写此链所使用币种的小数位数",
			},
			cConfigs: [
				{
					name: "",
					value: {
						//合约id
						id: "",
					},
				},
			],
		},
	};

	//增加配置的模版
	this.addFileTemplate = $(".addingLayerTemplate");

	//事件集合
	this.events = {
		//搜索文件夹
		searchForder: async function (_e) {
			var abis = [];
			var configs = [];
			for (var i = 0; i < $("[type=file]")[0].files.length; i++) {
				var file = $("[type=file]")[0].files[i];
				if (
					(file.path.indexOf("blockChanOperator/contractConfigs") !== -1 ||
						file.path.indexOf("blockChanOperator\\contractConfigs") !== -1) &&
					file.name !== ".DS_Store"
				) {
					self.data.configPath = file.path.replace(file.name, "");
					//var fileContent = fs.readFileSync(file.path, "utf-8");
					var fileContent = await self.initConfigFile(fileContent, file.path);
					var nPath = file.path.replace(file.name, "");
					nPath = nPath.replace("contractConfigs", "abis");
					self.data.abiPath = nPath;
					configs.push({
						name: file.name,
						path: file.path,
						content: fileContent,
					});
				}
				debugger;
				if (
					(file.path.indexOf("blockChanOperator/abis") !== -1 ||
						file.path.indexOf("blockChanOperator\\abis") !== -1) &&
					file.name !== ".DS_Store"
				) {
					self.data.abiPath = file.path.replace(file.name, "");
					var fileContent = fs.readFileSync(file.path, "utf-8");
					abis.push({
						name: file.name,
						path: file.path,
						content: fileContent,
					});
				}
			}
			self.data.fileList_configs = configs;
			self.data.fileList_abis = abis;

			self.absConfig("dev");
			self.absConfig("pro");
			self.data.isShowCCMain = true;
			self.mvvm.update();
		},
		//更改配置
		changeConfig: function (_e) {
			if (
				window.confirm(
					"确认开始替换配置文件吗?请仔细检查您的配置,这项操作将替换您项目中的合约配置文件,如果配置出现问题,项目中的合约相关操作将出现问题!!!请仔细核对好需要替换的信息后以继续.."
				)
			) {
				$(".loadding").show();
				self.saveConfig();
			}
		},
		//显示隐藏面板
		showPanel: function (_e, _panelFlag) {
			self.data.isShowSPage = _panelFlag;
			$(".modify_func_btn div").removeClass("selected");
			if (_panelFlag === true) {
				$("[data-name=s_set]").addClass("selected");
			} else {
				$("[data-name=m_set]").addClass("selected");
			}
		},
		//增加配置文件
		addConConfigFile: function () {
			var template = self.addFileTemplate.clone();
			var data = { ...self.addingData };
			data.dev.info.depChainId = self.data.deps.dev.depChainId;
			data.dev.info.depChainName = self.data.deps.dev.depChainName;
			data.dev.info.provider = self.data.deps.dev.depChainNode;
			data.dev.info.abiOnlineLinkTemp = self.data.deps.dev.depChainfix;
			data.dev.info.symbol = self.data.deps.dev.depSymbol;
			data.dev.info.visitUrl = self.data.deps.dev.depVisitUrl;
			data.dev.info.decimals = self.data.deps.dev.depDecimals;

			data.pro.info.depChainId = self.data.deps.pro.depChainId;
			data.pro.info.depChainName = self.data.deps.pro.depChainName;
			data.pro.info.provider = self.data.deps.pro.depChainNode;
			data.pro.info.abiOnlineLinkTemp = self.data.deps.pro.depChainfix;
			data.pro.info.symbol = self.data.deps.pro.depSymbol;
			data.pro.info.visitUrl = self.data.deps.pro.depVisitUrl;
			data.pro.info.decimals = self.data.deps.pro.depDecimals;

			data.path = self.data.configPath;
			var tempMvvm = new mvvm({
				htmlObject: template,
				data: data,
				eventsList: {
					//删除一条配置
					deleteConfig: function (_e, _type, _index) {
						if (data[_type].cConfigs.length <= 1) {
							alert("不可删除最后一条配置!");
							return;
						}
						var index = _index - 1;
						var newConfig = [];
						for (var i = 0; i < data[_type].cConfigs.length; i++) {
							var item = data[_type].cConfigs[i];
							if (i !== index) {
								newConfig.push(item);
							}
						}
						data[_type].cConfigs = newConfig;
						tempMvvm.update();
					},
					//增加一条配置
					addOneConfig: function (_e, _type) {
						data[_type].cConfigs.push({
							name: "contract1",
							value: {
								//合约id
								id: "0x640F665bBCDFA1dE6724D0AC5Dc78AC4c3B56206",
							},
						});
						tempMvvm.update();
					},
					//保存配置文件
					saveConfig: function () {
						if (
							confirm(
								"请确保您所配置的合约信息有效,例如在“依赖链ABI文件请求前缀”这一栏填写错误,ABI文件将不会被正确地配置完成.点击确定开始保存并配置此文件中描述的智能合约.."
							)
						) {
							$(".loadding").show();
							self.console.write("正在进行合约配置文件的保存工作..");
							self.insertConfigs(data);
						}
					},
				},
			});
			var w = new liWindow({
				title: "增加合约配置文件",
				content: template,
				size: {
					width: "auto",
				},
				closeCall: function () {
					tempMvvm.distroy();
				},
			});
			w.open();
			template.show();

			tempMvvm.init();
			data = tempMvvm.data;
		},
	};

	//插入到全局配置中去病保存
	this.insertConfigs = function (_data) {
		var insertModual = {
			content: { dev: {}, pro: {} },
			i: self.data.fileList_configs.length,
			name: _data.filename + "Config.js",
			path: _data.path + _data.filename + "Config.js",
		};

		for (var i = 0; i < self.data.fileList_configs.length; i++) {
			var item = self.data.fileList_configs[i];
			if (item.name === insertModual.name) {
				alert("已经存在相同的合约配置文件了,请重新命名!");
				return;
			}
		}

		//生成配置
		var genContent = function (_type, _item) {
			var modal = {
				info: {
					depChainId: _item.info.depChainId,
					depChainName: _item.info.depChainName,
					depChainNode: _item.info.provider,
					depSymbol: _item.info.symbol,
					depChainfix: _item.info.abiOnlineLinkTemp,
					depDecimals: _item.info.decimals,
					depVisitUrl: _item.info.visitUrl,
				},
			};
			for (var i = 0; i < _item.cConfigs.length; i++) {
				var ktem = _item.cConfigs[i];
				if ($.trim(ktem.value.id) === "") {
					alert("您未配置合约id");
					return;
				}
				if ($.trim(ktem.name) === "") {
					alert("您未配置合约名称");
					return;
				}
				modal[ktem.name] = {
					id: ktem.value.id,
					abiFileName: "../abis/" + ktem.name.toLowerCase() + "_abi_" + _type + ".json",
					abiOnline: _item.info.abiOnlineLinkTemp.replace("[{HASH}]", ktem.value.id),
					provider: _item.info.provider,
					depNetWork: _item.depChainName,
				};
			}

			return modal;
		};

		insertModual.content.dev = genContent("dev", _data.dev);
		insertModual.content.pro = genContent("pro", _data.pro);
		self.data.fileList_configs.push(insertModual);
		self.mvvm.update();

		//重新抽象一遍配置
		self.absConfig("dev");
		self.absConfig("pro");
		self.saveConfig();
	};

	//保存配置
	this.saveConfig = async function () {
		//第一步,请求在线的abi文件
		//第二步,保存新的abi文件
		//第三步,更新集成配置文件
		await this.updateData("dev");
		await this.updateData("pro");
		//第四步,循环每个合约配置文件结合集成配置文件输出新的合约配置文件并覆盖
		await this.saveConfigFiles();
		alert("配置文件更新完成");
		$(".loadding").hide();
	};

	//第四步,循环每个合约配置文件结合集成配置文件输出新的合约配置文件并覆盖
	this.saveConfigFiles = async function () {
		for (var i = 0; i < self.data.fileList_configs.length; i++) {
			var fItem = self.data.fileList_configs[i];
			try {
				var module = await import(fItem.path);
			} catch (_e) {
				var module = { contractConfig: JSON.parse(JSON.stringify(fItem.content)) };
			}
			var newConfig = this.getNewConfig(module.contractConfig);
			fs.writeFileSync(fItem.path, newConfig);
		}
	};

	//拼写新配置
	this.getNewConfig = function (_module) {
		var getConfig = function (_type) {
			var totalConfig = self.data.configs[_type];
			var depInfo = self.data.deps[_type];
			var cStr = "";
			for (var i in _module[_type]) {
				if (i !== "info") {
					var item = _module[_type][i];
					for (var k = 0; k < totalConfig.length; k++) {
						var ktem = totalConfig[k];
						if (ktem.name === i) {
							if (cStr !== "") {
								cStr += ",";
							}
							cStr +=
								ktem.name +
								`:{
									//合约id
									id:"` +
								ktem.id +
								`",
									//abi本地文件位置
									abiFileName:"` +
								ktem.abiFileName +
								`",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"` +
								ktem.abiOnline +
								`",
									//web3链接节点的地址
									provider:"` +
								ktem.provider +
								`",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["` +
								ktem.abiFileName +
								`"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"` +
								ktem.depNetWork +
								`"
							}`;
							break;
						}
					}
				}
			}

			return cStr;
		};

		var devConfigs = getConfig("dev");
		var proConfigs = getConfig("pro");

		var config =
			`
			/**
			 * 合约配置文件替换器自动生成
			 * 用于使web3Operator/metaMaskOperator载入的合约配置文件
			 */
			const contractConfig = {
				//测试环境
				dev:{
					//环境信息
					info: {
						//依赖的网络id
						depChainId: ` +
			this.data.deps.dev.depChainId +
			`,
						//依赖的网络名称
						depChainName: "` +
			this.data.deps.dev.depChainName +
			`",
						//web3链接节点的地址
						provider: "` +
			this.data.deps.dev.depChainNode +
			`",
						//web3链接节点的符号
						symbol: "` +
			this.data.deps.dev.depSymbol +
			`",
						//查询浏览器的访问地址
						visitUrl: "` +
			this.data.deps.dev.depVisitUrl +
			`",
						//小数位数
						decimals: ` +
			this.data.deps.dev.depDecimals +
			`,
					},
					` +
			devConfigs +
			`
				},
				//正式环境
				pro:{
					//环境信息
					info: {
						//依赖的网络id
						depChainId: ` +
			this.data.deps.pro.depChainId +
			`,
						//依赖的网络名称
						depChainName:  "` +
			this.data.deps.pro.depChainName +
			`",
						//web3链接节点的地址
						provider: "` +
			this.data.deps.pro.depChainNode +
			`",
						//web3链接节点的符号
						symbol: "` +
			this.data.deps.pro.depSymbol +
			`",
						//查询浏览器的访问地址
						visitUrl: "` +
			this.data.deps.pro.depVisitUrl +
			`",
						//小数位数
						decimals: ` +
			this.data.deps.pro.depDecimals +
			`,
					},
					` +
			proConfigs +
			`
				}
			};
			export { contractConfig };
		`;
		//config = prettier.format(config, { semi: false });

		return config;
	};

	//请求abi并保存新的abi文件,然后再更换集成配置里的信息
	this.updateData = async function (_type) {
		var config = this.data.configs[_type];
		var deps = this.data.deps[_type];

		var abis = [];
		var complete = function () {};
		for (var i = 0; i < config.length; i++) {
			var item = config[i];
			var fileName = item.name.toLowerCase() + "_abi_" + _type + ".json";
			var abi = {
				fileName: fileName,
				path: self.data.abiPath + fileName,
				contents: "",
			};
			self.console.write("正在更新ABI文件:[" + item.id + "]合约名称:[" + fileName + "]....");
			abi.contents = await self.fData(deps.depChainfix.replace("[{HASH}]", item.id), {
				method: "GET", // or 'PUT'
				credentials: "include",
				headers: new Headers({
					Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
					"Accept-Language":
						"zh,en;q=0.9,zh-CN;q=0.8,en-US;q=0.7,ja;q=0.6,de;q=0.5,ru;q=0.4,ko;q=0.3",
					"Cache-Control": "no-cache",
					Connection: "keep-alive",
					Cookie: self.fakeCookie,
					Host: "api.bscscan.com",
					Pragma: "no-cache",
					"Upgrade-Insecure-Requests": "1",
					"User-Agent":
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
				}),
			});
			abi.contents = await abi.contents.text();
			fs.writeFileSync(abi.path, abi.contents);
			item.abiFileName = "../abis/" + fileName;
			self.console.write("....更新完成!");
			item.abiOnline = deps.depChainfix.replace("[{HASH}]", item.id);
			item.provider = deps.depChainNode;
			item.depNetWork = deps.depChainName;
		}
	};

	this.fData = async function (_a, _b) {
		var p = new Promise(function (_reslove, rej) {
			setTimeout(() => {
				fetch(_a, _b)
					.then(
						function (_res) {
							_reslove(_res);
						},
						async function () {
							_reslove(await self.fData(_a, _b));
						}
					)
					.catch(async function (_e) {
						_reslove(await self.fData(_a, _b));
					});
			}, 6000);
		});
		return p;
	};

	//初始化配置文件
	this.initConfigFile = async function (_cfg, _path) {
		var module = await import(_path);
		return module.contractConfig;
	};

	//抽象所有配置
	this.absConfig = function (_type) {
		var allConfigs = {};
		for (var i = 0; i < this.data.fileList_configs.length; i++) {
			var config = this.data.fileList_configs[i].content[_type];
			for (var k in config) {
				if (k !== "info") {
					var node = config[k];
					node.name = k;
					allConfigs[k] = node;
				}
			}
		}
		var arr = [];
		for (var k in allConfigs) {
			arr.push(allConfigs[k]);
		}

		var cfg = this.data.fileList_configs[0].content[_type];
		this.data.deps[_type].depChainId = cfg.info.depChainId;
		this.data.deps[_type].depChainName = cfg.info.depChainName;
		this.data.deps[_type].depSymbol = cfg.info.symbol;
		this.data.deps[_type].depVisitUrl = cfg.info.visitUrl;
		this.data.deps[_type].depDecimals = cfg.info.decimals;
		this.data.deps[_type].depChainNode = arr[0].provider;
		this.data.deps[_type].depChainfix = arr[0].abiOnline.replace(arr[0].id, "[{HASH}]");

		this.data.configs[_type] = arr;
	};

	//初始化函数
	this.init = function () {
		this.mvvm = new mvvm({
			htmlObject: $(".template"),
			data: this.data,
			eventsList: this.events,
		});
		this.mvvm.init();
		this.data = self.data = this.mvvm.data;
	};

	//查找合约位置
	this.findContractPath = function () {};

	//查找abi文件位置
	this.findAbiPath = function () {};
};

$(document).ready(function () {
	window.index = new _index();
	window.index.init();
});
