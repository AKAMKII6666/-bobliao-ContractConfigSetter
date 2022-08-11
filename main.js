/**
 * 廖力编写 2021/10/14
 * 智能合约配置文件修改器的窗口对象
 */
const { app, BrowserWindow } = require("electron");

/**
 * 主窗口对象cd
 */
const _mainWindow = function () {
	var self = this;
	//窗口对象
	this.currentWindow = null;
	//初始化方法
	this.init = function () {
		this.initWindow();
	};
	//初始化窗口的方法
	this.initWindow = function () {
		this.currentWindow = new BrowserWindow({
			width: 1400,
			height: 1000,
			hasShadow: true,
			webPreferences: {
				//开发工具
				devTools: true,
				//electron12 已经把node集成默认关掉了,需要设置这个:
				contextIsolation: false,
				//启用页面级别的node支持
				nodeIntegration: true,
				//启用远程调用
				enableRemoteModule: true,
				//启用页面级别的node支持
				nodeIntegrationInWorker: true,
				//iframe里面也集成node支持
				nodeIntegrationInSubFrames: true,
				//指示是否可以跨域
				webSecurity: false,
			},
		});

		this.currentWindow.loadFile("index.html");
		this.currentWindow.webContents.openDevTools();
	};
};

//当electron底层准备完成的时候就初始化窗口
app.whenReady().then(() => {
	const mainWindow = new _mainWindow();
	mainWindow.init();
});
