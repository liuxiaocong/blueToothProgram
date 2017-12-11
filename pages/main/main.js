//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    currentDevices: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    searchDevices:false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  openWeui: function(){
    wx.navigateTo({
      url: '/pages/weui/index'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
    wx.openBluetoothAdapter({
      success: (res)=> {
        console.log(res);
        this.startSearchDevices(5000);
        this.getBluetoothDevices();
      },
      fail: function (err) {
        console.log(err);
      }
    })
    wx.onBluetoothAdapterStateChange(function (res) {
      console.log(`adapterState changed, now is`, res)
    })
    wx.onBluetoothDeviceFound((res)=> {
      console.log('onBluetoothDeviceFound');
      console.log(res);
      if (res.devices) {
        this.setData({
          currentDevices: res.devices
        });
      }
    });
  },

  onUnload:function(){
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log(res)
      }
    })
    this.stopSearchDevices();
  },

  loadBluetoothDevices:function(){
    this.getBluetoothDevices();
  },

  startSearchDevices:function(time){
    if (this.data.searchDevices){
      return;
    }
    this.setData({
      searchDevices:true,
    })
    wx.startBluetoothDevicesDiscovery({
      success:  (res)=> {
        console.log("开始搜索附近蓝牙设备")
        console.log(res);
      }
    })
    setTimeout(()=>{
      this.setData({
        searchDevices: false,
      });
      this.stopSearchDevices();
    },time);
  },

  stopSearchDevices:function(){
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("停止蓝牙搜索")
        console.log(res)
      }
    })
  },

  getBluetoothDevices:function(){
    wx.getBluetoothDevices({
      success: function (res) {
        console.log(res)
        if (res.devices[0]) {
          console.log(ab2hex(res.devices[0].advertisData))
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },

  globalData: {
    userInfo: null
  },
})
