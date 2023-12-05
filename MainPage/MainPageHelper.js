// MyAuraComponentController.js
({
    SearchHelper: function(component, event, helper) { 
        var action = component.get("c.getSearchList");
        action.setParams({
            searchKeyWord: component.get("v.searchKeyWord"),
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
              var storeResponse = response.getReturnValue();
              component.set("v.ankenList", storeResponse);
      
            } else if (state === "INCOMPLETE") {
              alert("Response is Incompleted");
            } else if (state === "ERROR") {
              var errors = response.getError();
              if (errors) {
                if (errors[0] && errors[0].message) {
                  alert("Error message: " + errors[0].message);
                }
              } else {
                alert("Unknown error");
              }
            }
          }); 
        $A.enqueueAction(action);   
    },
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
  
  
})
