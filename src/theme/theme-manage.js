function ThemeManager() {

  var themeName;
  var themetypes = [{
    type: "",
    obj: ""
  }];

  //设置themeName
  this.setThemeName = function (type) {
    themeName = type;
  }

  this.getThemeName = function () {
    return themeName;
  }

  //添加动画对象到数组
  this.add = function (typetheme, newObj) {
    themetypes.push({
      type: typetheme,
      obj: newObj,
      defalutConfig: newObj.getDefalutConfig(),
    });
  }

  //取得动画对象		
  this.getThemeObj = function (themetype) {
    var index = -1;
    for (var i = 0; i < themetypes.length; i++) {
      if (themetypes[i].type == themetype)
        index = i;
    }
    return index > -1 ? themetypes[index].obj : {
      getDefalutConfig: () => {return {}}
    }
  }
}


export {
  ThemeManager,
}