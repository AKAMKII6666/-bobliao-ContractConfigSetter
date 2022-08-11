
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
						depChainId: 97,
						//依赖的网络名称
						depChainName: "BSC Test Network",
						//web3链接节点的地址
						provider: "https://data-seed-prebsc-1-s1.binance.org:8545/",
						//web3链接节点的符号
						symbol: "BNBTest",
						//查询浏览器的访问地址
						visitUrl: "https://testnet.bscscan.com/",
						//小数位数
						decimals: 18,
					},
					GPIGToken:{
									//合约id
									id:"0x0A64bD0385F77a866271c28bD4ac14c6e806eB32",
									//abi本地文件位置
									abiFileName:"../abis/gpigtoken_abi_dev.json",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=0x0A64bD0385F77a866271c28bD4ac14c6e806eB32&format=raw",
									//web3链接节点的地址
									provider:"https://data-seed-prebsc-1-s1.binance.org:8545/",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["../abis/gpigtoken_abi_dev.json"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"BSC Test Network"
							},GstoNFT:{
									//合约id
									id:"0x4673124b80f1EB4A96de153C22756C1CA0135DEC",
									//abi本地文件位置
									abiFileName:"../abis/gstonft_abi_dev.json",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=0x4673124b80f1EB4A96de153C22756C1CA0135DEC&format=raw",
									//web3链接节点的地址
									provider:"https://data-seed-prebsc-1-s1.binance.org:8545/",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["../abis/gstonft_abi_dev.json"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"BSC Test Network"
							},ExchangeGSTO:{
									//合约id
									id:"0xFeCD923F7D6776d03d049EBF0048DEDbe2160068",
									//abi本地文件位置
									abiFileName:"../abis/exchangegsto_abi_dev.json",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=0xFeCD923F7D6776d03d049EBF0048DEDbe2160068&format=raw",
									//web3链接节点的地址
									provider:"https://data-seed-prebsc-1-s1.binance.org:8545/",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["../abis/exchangegsto_abi_dev.json"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"BSC Test Network"
							},UniswapV2Pair:{
									//合约id
									id:"0xe6004B217263439944902B775C89d4c41EB4CdD5",
									//abi本地文件位置
									abiFileName:"../abis/uniswapv2pair_abi_dev.json",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=0xe6004B217263439944902B775C89d4c41EB4CdD5&format=raw",
									//web3链接节点的地址
									provider:"https://data-seed-prebsc-1-s1.binance.org:8545/",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["../abis/uniswapv2pair_abi_dev.json"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"BSC Test Network"
							}
				},
				//正式环境
				pro:{
					//环境信息
					info: {
						//依赖的网络id
						depChainId: 56,
						//依赖的网络名称
						depChainName:  "BSC Main Network",
						//web3链接节点的地址
						provider: "https://bsc-dataseed1.binance.org/",
						//web3链接节点的符号
						symbol: "BNB",
						//查询浏览器的访问地址
						visitUrl: "https://bscscan.com/",
						//小数位数
						decimals: 18,
					},
					GPIGToken:{
									//合约id
									id:"0xd96265C5b772cb409924E08F242c6853A3e5c2C0",
									//abi本地文件位置
									abiFileName:"../abis/gpigtoken_abi_pro.json",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"http://api.bscscan.com/api?module=contract&action=getabi&address=0xd96265C5b772cb409924E08F242c6853A3e5c2C0&format=raw",
									//web3链接节点的地址
									provider:"https://bsc-dataseed1.binance.org/",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["../abis/gpigtoken_abi_pro.json"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"BSC Main Network"
							},GstoNFT:{
									//合约id
									id:"0x16a2Bd823C5FFD84e489F9Db270AC7F16e20fE32",
									//abi本地文件位置
									abiFileName:"../abis/gstonft_abi_pro.json",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"http://api.bscscan.com/api?module=contract&action=getabi&address=0x16a2Bd823C5FFD84e489F9Db270AC7F16e20fE32&format=raw",
									//web3链接节点的地址
									provider:"https://bsc-dataseed1.binance.org/",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["../abis/gstonft_abi_pro.json"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"BSC Main Network"
							},ExchangeGSTO:{
									//合约id
									id:"0xB02656c037FF6a22Cbb12951cd3c706D3E19363c",
									//abi本地文件位置
									abiFileName:"../abis/exchangegsto_abi_pro.json",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"http://api.bscscan.com/api?module=contract&action=getabi&address=0xB02656c037FF6a22Cbb12951cd3c706D3E19363c&format=raw",
									//web3链接节点的地址
									provider:"https://bsc-dataseed1.binance.org/",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["../abis/exchangegsto_abi_pro.json"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"BSC Main Network"
							},UniswapV2Pair:{
									//合约id
									id:"0xD4Fa597932EfeF6E23699b3Ee70d53f72E940264",
									//abi本地文件位置
									abiFileName:"../abis/uniswapv2pair_abi_pro.json",
									//在线的abi文件地址,可以通过这个地址直接拿取线上的abi文件
									abiOnline:"http://api.bscscan.com/api?module=contract&action=getabi&address=0xD4Fa597932EfeF6E23699b3Ee70d53f72E940264&format=raw",
									//web3链接节点的地址
									provider:"https://bsc-dataseed1.binance.org/",
									//异步获得本地版本的abi文件
									getAbiAsync:function(_callback){
										require(["../abis/uniswapv2pair_abi_pro.json"], function (_abi) {
											_callback(_abi);
										});
									},
								//依赖哪个网络
								depNetWork:"BSC Main Network"
							}
				}
			};
			export { contractConfig };
		