// MyAuraComponentController.js
({
    // SearchHelper: function(component, event, helper) { 
    //     var action = component.get("c.getSearchList");
    //     action.setParams({
    //         searchKeyWord: component.get("v.searchKeyWord"),
    //     });
    //     action.setCallback(this, function (response) {
    //         var state = response.getState();
    //         if (state === "SUCCESS") {
    //           var storeResponse = response.getReturnValue();
    //           component.set("v.ankenList", storeResponse);
      
    //         } else if (state === "INCOMPLETE") {
    //           alert("Response is Incompleted");
    //         } else if (state === "ERROR") {
    //           var errors = response.getError();
    //           if (errors) {
    //             if (errors[0] && errors[0].message) {
    //               alert("Error message: " + errors[0].message);
    //             }
    //           } else {
    //             alert("Unknown error");
    //           }
    //         }
    //       }); 
    //     $A.enqueueAction(action);   
    // },
    doInitHelper: function(component, event, helper) {
        // 获取用于检索的搜索词
        var pathName = component.get("v.pathName");
        var searchTerm = component.get("v.searchKeyWord");
        console.log('searchTerm ->>>>>>'+searchTerm);
        // var searchTerm = "案件名1";
        // 调用后端 Apex 方法，并传递搜索词
        var action = component.get("c.getSearchList");
        action.setParams({ 
          pathName: pathName,
          searchTerm: searchTerm,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
              // 给左侧列表すべて 样式
              var domElement = component.find("myListItem1").getElement();
              $A.util.addClass(domElement, 'liMouseUpActive');
              var records = response.getReturnValue();
              if(records !== null){
                this.modifyObject(records);
                if(records.length > 5){
                    component.set("v.resultsNumber", records.length);
                }
              }
              component.set("v.dataList", response.getReturnValue());
            } else if (state === "ERROR") {
                // 处理错误
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    },
    // 時間を日付に変換する
    // modifyObject: function(inputObject) {
    //     if (typeof inputObject === 'object' && inputObject !== null) {
    //       for (var i = 0; i < inputObject.length; i++) {
    //         const isoDateString  = new Date(inputObject[i].LastModifiedDate).toISOString();
    //         const dateObject = new Date(isoDateString );
    //         const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    //         inputObject[i].LastModifiedDate = dateObject.toLocaleDateString(undefined, options);
    //       }
    //       return inputObject;
    //     } else {
    //       throw new Error('Input must be an object');
    //     }
    // }
    modifyObject: function(inputObject) {
      if (typeof inputObject === 'object' && inputObject !== null) {
          for (var i = 0; i < inputObject.length; i++) {
              if (inputObject[i].LastModifiedDate) {
                  const dateObject = new Date(inputObject[i].LastModifiedDate);
  
                  // 获取年、月、日、小时、分钟
                  const year = dateObject.getFullYear();
                  const month = ('0' + (dateObject.getMonth() + 1)).slice(-2); // 注意月份从0开始
                  const day = ('0' + dateObject.getDate()).slice(-2);
                  const hours = ('0' + dateObject.getHours()).slice(-2);
                  const minutes = ('0' + dateObject.getMinutes()).slice(-2);
  
                  // 构建年月日时分字符串
                  const formattedDate = `${year}年${month}月${day}日 ${hours}:${minutes}`;
  
                  // 更新属性值
                  inputObject[i].LastModifiedDate = formattedDate;
              }
          }
          return inputObject;
      } else {
          throw new Error('Input must be an array');
      }
  },
  sortBy: function(field, order) {
    var isAsc = order === 'asc';
    return function(a, b) {
        var valueA = a[field];
        var valueB = b[field];

        if (isAsc) {
            return valueA < valueB ? -1 : 1;
        } else {
            return valueA > valueB ? -1 : 1;
        }
    };
  },
  getAllData: function(component, event, helper) {
        component.set("v.data", component.get("v.matchedData"));
  },
  buttonStatusHelper: function(component, event, helper) {
    var bangouClear = component.get("v.bangouClear");
    var openTimeClear = component.get("v.openTimeClear");
    var keimeiClear = component.get("v.keimeiClear");
    if( (bangouClear && openTimeClear) 
        || (openTimeClear && keimeiClear)
        || (bangouClear && keimeiClear) ) {
          component.set("v.buttonStatus", true);
        } else {
          component.set("v.buttonStatus", false);
    }
  },
  searchHelper: function(component, event, helper) {
        var dataList = component.get("v.matchedData");
        // console.log("apexList"+dataList);
        var searchBangou = component.find("searchBangou").getElement().value.toLowerCase();
        // console.log("searchBangou"+searchBangou);
        var searchOpenTime = component.find("InputSelectSingle").get("v.value");
        // console.log("searchOpenTime"+searchOpenTime);
        var searchName = component.find("searchKeimei").getElement().value.toLowerCase();
        // console.log("searchName"+searchName);
        searchBangou = searchBangou.replace(/[０-９]/g, function (char) {
            return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
        });
        searchName = searchName.replace(/[０-９]/g, function (char) {
            return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
        });

        var matchedData = dataList.filter(function(item) {
            var age = (item.Age).replace('年','/').replace('月','/').replace('日','');
            var currentDate = new Date();
            var itemTime = new Date(age).toLocaleDateString();
            var itemStamp= new Date(age).getTime();
            var DaysAgo = new Date();
            var itemId = item.Id.toLowerCase();
            var itemName = item.Name.toLowerCase();
            itemId = itemId.replace(/[０-９]/g, function (char) {
                return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
            });
            itemName = itemName.replace(/[０-９]/g, function (char) {
                return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
            });
            console.log("age"+age);
            if (searchBangou != '') {
                if(searchOpenTime != '選択...'){
                    if(searchName != ''){
                        console.log("pass 001");
                        
                        if(searchOpenTime == '今日'){
                            console.log("pass 002");
                            return (itemId).includes(searchBangou)
                            && itemTime == currentDate.toLocaleDateString()
                            && (itemName).includes(searchName);
                        } else {
                            console.log("pass 003");
                            let extractedNumbers = searchOpenTime.split(' ');
                            DaysAgo.setDate(currentDate.getDate() - extractedNumbers[1]);
                            // console.log("itemTime"+itemTime);
                            // console.log("itemTime"+itemStamp);
                            return (itemId).includes(searchBangou) 
                            && itemStamp >= DaysAgo.getTime() && itemStamp <= currentDate.getTime()
                            && (itemName).includes(searchName);
                        }
                    } else {
                        if(searchOpenTime == '今日'){
                            console.log("pass 004");
                            return (itemId).includes(searchBangou) 
                            && itemTime == currentDate.toLocaleDateString();
                        } else {
                            console.log("pass 005");
                            
                            console.log(searchOpenTime);
                            let extractedNumbers = searchOpenTime.split(' ');
                            console.log(extractedNumbers);
                            DaysAgo.setDate(currentDate.getDate() - extractedNumbers[1]);
                            return (itemId).includes(searchBangou) 
                            && itemStamp >= DaysAgo.getTime() && itemStamp <= currentDate.getTime();
                        }
                    }
                } else if(searchName != '') {
                    console.log("pass 006");
                    return (itemId).includes(searchBangou) && itemName === searchName;
                } else {
                    console.log("pass 007");
                    return (itemId).includes(searchBangou);
                }
                
            } else if(searchOpenTime != '選択...') {
                if(searchName != ''){
                        if(searchOpenTime == '今日'){
                            console.log("pass 008");
                            return itemTime == currentDate.toLocaleDateString()
                            && (itemName).includes(searchName);
                        } else {
                            console.log("pass 009");
                            
                            let extractedNumbers = searchOpenTime.split(' ');
                            DaysAgo.setDate(currentDate.getDate() - extractedNumbers[1]);
                            return itemStamp >= DaysAgo.getTime() 
                            && itemStamp <= currentDate.getTime()
                            && (itemName).includes(searchName);
                        }
                } else {
                    if(searchOpenTime == '今日'){
                        console.log("pass 010");
                        console.log("itemTime"+itemTime);
                        console.log("itemTime"+currentDate.toLocaleDateString());
                        return itemTime == currentDate.toLocaleDateString();
                    } else {
                        console.log("pass 011");
                        
                        console.log("111111"+itemStamp);
                        
                        let extractedNumbers = searchOpenTime.split(' ');
                        DaysAgo.setDate(currentDate.getDate() - extractedNumbers[1]);
                        return itemStamp >= DaysAgo.getTime() && itemStamp <= currentDate.getTime();
                    }
                }
            } else if(searchName != '') {
                console.log("pass 013");
                return (itemName).includes(searchName);
            } else {
                return null;
            }
        });
        console.log("67777"+matchedData);
        // Update the attribute to trigger re-rendering
        component.set("v.data", matchedData);
  },
  // 获得焦点
  focusHelper: function(component, event, helper) {
    var inputValue = event.target.value;
    var inputName = event.currentTarget.dataset.inputValue;
    if(inputName == 'searchBangou'){
        component.set("v.inputClass", "hasApply-button");
        if (inputValue && inputValue.trim().length > 0) {
          // 输入框有文字，添加类名
          component.set("v.bangouSearchBlock", true);
          component.set("v.bangouSearchDisabled", false);
        } else {
          // 输入框无文字，移除类名
          component.set("v.bangouSearchBlock", false);
          component.set("v.bangouSearchDisabled", true);
        }        
    }
    if(inputName == 'searchKeimei'){
        component.set("v.inputKeimeiClass", "hasApply-button");
        if (inputValue && inputValue.trim().length > 0) {
          // 输入框有文字，添加类名
          component.set("v.keimeiSearchBlock", true);
          component.set("v.keimeiSearchDisabled", false);
        } else {
          // 输入框无文字，移除类名
          component.set("v.keimeiSearchBlock", false);
          component.set("v.keimeiSearchDisabled", true);
        }        
    }

  },
  // 失去焦点
  blurHelper: function(component, event, helper) {
    var inputValue = event.target.value;
    var inputName = event.currentTarget.dataset.inputValue;
    console.log("11123"+inputName);
    if(inputName == 'searchBangou'){
        if (inputValue && inputValue.trim().length > 0) {
          // 输入框有文字，添加类名
          component.set("v.inputClass", "hasApply-button");
          component.set("v.bangouSearchBlock", true);
          component.set("v.bangouSearchDisabled", "false");
        } else {
          // 输入框无文字，移除类名
          component.set("v.inputClass", "input-width");
          component.set("v.bangouSearchBlock", "false");
          component.set("v.bangouSearchDisabled", "false");
        }
    }
    if(inputName == 'searchKeimei'){
        if (inputValue && inputValue.trim().length > 0) {
          // 输入框有文字，添加类名
          component.set("v.inputKeimeiClass", "hasApply-button");
          component.set("v.keimeiSearchBlock", true);
          component.set("v.keimeiSearchDisabled", "false");
        } else {
          // 输入框无文字，移除类名
          component.set("v.inputKeimeiClass", "input-width");
          component.set("v.keimeiSearchBlock", "false");
          component.set("v.keimeiSearchDisabled", "false");
        }
    }
    
  },
  clearHelper: function(component, event, helper) {
      console.log("这里是清除事件");
      var inputValue = event.target.value;
      console.log("这里是清除事件"+inputValue);
      if(inputValue != ''){
          1
      }
      if(inputValue != ''){
          1
      }
      if(inputValue != ''){
          1
      }
  }
})
