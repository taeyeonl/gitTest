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
            //   // if storeResponse size is 0 ,display no record found message on screen.
            //   if (storeResponse.length == 0) {
            //     component.set("v.Message", true);
            //   } else {
            //     component.set("v.Message", false);
            //   }
            //   // set numberOfRecord attribute value with length of return value from server
            //   component.set("v.TotalNumberOfRecord", storeResponse.length);
            //   storeResponse.forEach(function (record) {
            //     record.linkName = "/" + record.Id;
            //   });
             
              component.set("v.ankenList", storeResponse);
       
            //   component.set("v.loadMoreStatus", "Completed");
            //   window.setTimeout(
            //     function() {
            //       event.getSource().set("v.isLoading", false);
            //     },1600
            //     );
      
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
                // 将返回的数据设置到组件属性中
                console.log('SUCCESS ->>>>>>'+response.getReturnValue());
                  var domElement = component.find("myListItem1").getElement();
                  $A.util.addClass(domElement, 'liMouseUpActive');
                component.set("v.dataList", response.getReturnValue());
            } else if (state === "ERROR") {
                // 处理错误
                console.error(response.getError());
            }
        });
        $A.enqueueAction(action);
    }

})
