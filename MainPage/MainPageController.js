// MyCustomController.js
({
    init: function(component, event, helper) {
        // 获取主机后半部分
        var pathname = window.location.pathname;
        var pathArray = pathname.substring(1).split('/');
        var lastSegment = pathArray.pop();
        lastSegment = decodeURIComponent(lastSegment);
        console.log("获取主机后半部分---->:", pathname);
        console.log("名字---->:", pathArray[0]);
        console.log("搜索关键词---->:", lastSegment);
        component.set("v.pathName", pathArray[0]);
        component.set("v.searchKeyWord", lastSegment);
        helper.doInitHelper(component, event);
        // 注册全局监听事件
        document.addEventListener('click', $A.getCallback(function(event) {
            // 点击div内部
            var clickedElement = event.target;
            console.log("点击div内部");
            var targetDiv = component.find('targetDiv').getElement();
            if (!targetDiv.contains(clickedElement)) {
                // 点击外部
                component.set("v.showDiv", false);
                console.log("点击外部");
            }
        }));
    },
    // 在鼠标按下时处理逻辑  
    handleMouseDown: function(component, event, helper) {
        // 获取被点击的元素
        var clickedElement = event.currentTarget;
        var clickedId = event.currentTarget.dataset.linkValue;
        if(clickedId == 'button5' || clickedId == 'button6') {
            $A.util.addClass(clickedElement, 'liButtonMouseDwonActive');
        } else {
            // 可以执行其他逻辑或调用帮助函数
            $A.util.addClass(clickedElement, 'liMouseDwonActive');
        }
    },
    // 在鼠标松开时处理逻辑  
    handleMouseUp: function(component, event, helper) {
        // 获取被点击的元素
        var clickedElement = event.currentTarget;
        var clickedId = event.currentTarget.dataset.linkValue;
        if(clickedId == 'button5' || clickedId == 'button6') {
            $A.util.addClass(clickedElement, 'liButtonMouseUpActive');
        } else {
            $A.util.removeClass(clickedElement, 'liMouseDwonActive');
            $A.util.addClass(clickedElement, 'liMouseUpActive');
        }        
    },
    // 点击完成时处理逻辑
    handleButtonClick: function(component, event, helper) {
        var clickedElement = event.currentTarget;
        
        // 获取所有的列表项
        var items = [
            component.find("myListItem1"),
            component.find("myListItem2"),
            component.find("myListItem3"),
            component.find("myListItem4"),
            component.find("myListItem5"),
            component.find("myListItem6")
        ];
        // 移除所有列表项的 liMouseUpActive 属性
        items.forEach(function(item) {
            var domElement = item.getElement();
            var auraId = item.getLocalId();
            var isHas = $A.util.hasClass(domElement, "hiddenItem");
            // 将隐藏的li列显示
            if( isHas ){
                $A.util.removeClass(domElement, 'hiddenItem');
                $A.util.addClass(domElement, 'blockItem');
            }
            // 给「リストを展開」添加属性
            if (auraId == 'myListItem6' ) {
                $A.util.removeClass(domElement, 'blockItem');
                $A.util.addClass(domElement, 'hiddenItem');
            }
            // 完成一次点击后  删除所有的鼠标up,down属性
            $A.util.removeClass(domElement, 'liMouseDwonActive');
            $A.util.removeClass(domElement, 'liMouseUpActive');
            $A.util.removeClass(domElement, 'liButtonMouseDwonActive');
            $A.util.removeClass(domElement, 'liButtonMouseUpActive');
        });
        $A.util.addClass(clickedElement, 'liMouseUpActive');


        // 获取点击的按钮的值
        var buttonValue = event.currentTarget.dataset.linkValue;
        console.log("当前按钮值->"+buttonValue);
        if(buttonValue == 'button3'){
            component.set("v.filterItems", true);
        } else {
            component.set("v.filterItems", false);
        }
        // 根据按钮值调用服务器端方法获取相应的内容
        var action = component.get("c.getButtonContent");
        action.setParams({
            buttonValue: buttonValue
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // 更新右侧画面的内容
                component.set("v.rightPanelContent", response.getReturnValue());
            } else {
                console.error("Error calling server-side action: " + state);
            }
        });

        $A.enqueueAction(action);
    },
    // リストを折りたたむ
    handleExpand: function(component, event, helper) {
        // 获取所有的列表项
        var items = [
            component.find("myListItem1"),
            component.find("myListItem2"),
            component.find("myListItem3"),
            component.find("myListItem4"),
            component.find("myListItem5"),
            component.find("myListItem6")
        ];
        // 移除所有列表项的 liMouseUpActive liButtonMouseUpActive 属性
        items.forEach(function(item) {
            var domElement = item.getElement();
            // 隐藏li 显示「リストを展開」button
            var auraId = item.getLocalId();
            var isHas = $A.util.hasClass(domElement, "liMouseUpActive");
            if (auraId == 'myListItem2' 
                || auraId == 'myListItem3'
                || auraId == 'myListItem4'
                || auraId == 'myListItem5') {
                    if ( !isHas ) {
                        $A.util.removeClass(domElement, 'blockItem');
                        $A.util.addClass(domElement, 'hiddenItem');
                    }
            }
            if(auraId == 'myListItem6') {
                $A.util.removeClass(domElement, 'hiddenItem');
                $A.util.addClass(domElement, 'blockItem');
            }
            $A.util.removeClass(domElement, 'liMouseDwonActive');
            if ( !isHas ) {
                $A.util.removeClass(domElement, 'liMouseUpActive');
            }
            $A.util.removeClass(domElement, 'liButtonMouseDwonActive');
            $A.util.removeClass(domElement, 'liButtonMouseUpActive');
        });
        
        // 获取被点击的元素
        var clickedElement = event.currentTarget;
        $A.util.addClass(clickedElement, 'liButtonMouseDwonActive');
    },

    // リストを展開
    handleFold: function(component, event, helper) {
        // 获取所有的列表项
        var items = [
            component.find("myListItem1"),
            component.find("myListItem2"),
            component.find("myListItem3"),
            component.find("myListItem4"),
            component.find("myListItem5"),
            component.find("myListItem6")
        ];
        // 移除所有列表项的 liMouseUpActive liButtonMouseUpActive 属性
        items.forEach(function(item) {
            var domElement = item.getElement();
            var auraId = item.getLocalId();
            var isHas = $A.util.hasClass(domElement, "liMouseUpActive");
            if (auraId == 'myListItem2' 
                || auraId == 'myListItem3'
                || auraId == 'myListItem4'
                || auraId == 'myListItem5') {
                    if ( !isHas ) {
                        $A.util.removeClass(domElement, 'hiddenItem');
                        $A.util.addClass(domElement, 'blockItem');
                    }
                }
                if(auraId == 'myListItem6') {
                $A.util.removeClass(domElement, 'blockItem');                
                $A.util.addClass(domElement, 'hiddenItem');
            }
            $A.util.removeClass(domElement, 'liMouseDwonActive');
            if ( !isHas ) {
                $A.util.removeClass(domElement, 'liMouseUpActive');
            }
            $A.util.removeClass(domElement, 'liButtonMouseDwonActive');
            $A.util.removeClass(domElement, 'liButtonMouseUpActive');
        });
        
        // 获取被点击的元素
        var clickedElement = event.currentTarget;
        $A.util.addClass(clickedElement, 'liButtonMouseDwonActive');
    },
    navigateToRecord : function(component, event, helper) {
        var recordId = event.currentTarget.dataset.recordid;

        // 使用 standard__recordPage 类型导航到记录页面
        var pageReference = {
            type: "standard__recordPage",
            attributes: {
                recordId: recordId,
                objectApiName: "Knowledge__kav",
                actionName: "view"
            }
        };

        // 导航到记录页面
        var navService = component.find("navService");
        navService.navigate(pageReference);
    },
    showAllItems: function(component, event, helper) {
        component.set("v.showAllItems", true);
        component.set("v.isBlock", false);
    },

    // ケースStart
    sortData: function(component, event, helper) {
        var fieldName = event.currentTarget.dataset.field;
        fieldName = fieldName.split('-');
        
        
        if( fieldName[1] ){
            var currentOrder ="asc";
        } else {
            var currentOrder = component.get("v.sortOrder") === "asc" ? "desc" : "asc";
        }
        fieldName = fieldName[0];

        if(fieldName =="KanRen") {
            fieldName = "Name";
            component.set("v.KanRen", "関連");
            component.set("v.sortButton", "関連");
        } else {
            switch (fieldName) {
                case "Name":
                    component.set("v.sortButton", "ケース番号");
                    break;
                case "Age":
                    component.set("v.sortButton", "オープン日時");
                    break;
                case "City":
                    component.set("v.sortButton", "件名");
                    break;
                default:
                    component.set("v.sortButton", "関連");
              }
              component.set("v.KanRen", "");
        }

		if (fieldName === component.get("v.sortField")) {
            // 如果相同，则切换排序方向
			component.set("v.sortOrder", currentOrder);
        } else {
            // 如果不同，则默认为升序
            component.set("v.sortOrder", "asc");
        }
        
        // Perform sorting
        var data = component.get("v.data");
        data.sort(helper.sortBy(fieldName, currentOrder));
        // Update component attributes
        component.set("v.data", data);
        component.set("v.sortField", fieldName);
          
    },
	showIcon: function(component, event, helper) {
		
		console.log("88888888888");
        component.set("v.showIcon", true);
    },
    
    hideIcon: function(component, event, helper) {
		console.log("9999999999999999");
        component.set("v.showIcon", false);
    },
	toggleDiv: function(component, event, helper) {
        component.set("v.showDiv", !component.get("v.showDiv"));
    },
	hideDiv: function(component, event, helper) {
        // Hide the div when clicked outside
        component.set("v.showDiv", false);
    },

    // 絞り込み項目
    bangouSearch: function(component, event, helper) {
        component.set("v.bangouClear", true);
        helper.searchHelper(component, event);
        helper.buttonStatusHelper(component, event);
    },
    openTimeSearch: function(component, event, helper) {
        if(component.find("InputSelectSingle").get("v.value") != '選択...'){
            component.set("v.openTimeClear", true);
            helper.searchHelper(component, event);
            helper.buttonStatusHelper(component, event);
        }

    },
    keimeiSearch: function(component, event, helper) {
        component.set("v.keimeiClear", true);
        helper.searchHelper(component, event);
        helper.buttonStatusHelper(component, event);
    },
    unSelect: function(component, event, helper) {
        component.find("searchBangou").getElement().value = '';
        component.set("v.bangouClear", false);
        component.set("v.inputClass", "input-width");
        component.set("v.bangouSearchBlock", false);
        component.set("v.bangouSearchDisabled", false);
        component.set("v.openTimeClear", false);
        component.find("InputSelectSingle").set("v.value", "選択...");
        component.find("searchKeimei").getElement().value = '';
        component.set("v.keimeiClear", false);
        component.set("v.inputKeimeiClass", "input-width");
        component.set("v.keimeiSearchBlock", false);
        component.set("v.keimeiSearchDisabled", false);
        component.set("v.buttonStatus", false);
        helper.getAllData(component, event);
    },
    bangouClear: function(component, event, helper) {
        console.log("清除事件");
        component.find("searchBangou").getElement().value = '';
        component.set("v.bangouClear", false);
        component.set("v.inputClass", "input-width");
        component.set("v.bangouSearchBlock", false);
        component.set("v.bangouSearchDisabled", false);
        helper.searchHelper(component, event);
        helper.buttonStatusHelper(component, event);
        
    },
    openTimeClear: function(component, event, helper) {
        console.log("清除事件2");
        component.set("v.openTimeClear", false);
        component.find("InputSelectSingle").set("v.value", "選択...");
        helper.searchHelper(component, event);
        helper.buttonStatusHelper(component, event);
    },
    keimeiClear: function(component, event, helper) {
        console.log("清除事件3");
        component.find("searchKeimei").getElement().value = '';
        component.set("v.keimeiClear", false);
        component.set("v.inputKeimeiClass", "input-width");
        component.set("v.keimeiSearchBlock", false);
        component.set("v.keimeiSearchDisabled", false);
        helper.searchHelper(component, event);
        helper.buttonStatusHelper(component, event);
    },
    handleFocus: function(component, event, helper) {
        console.log("获得焦点");
        helper.focusHelper(component, event);
    },
    handleBlur: function(component, event, helper) {
        console.log("失去焦点");        
        helper.blurHelper(component, event);
    },
    handleBangouChange: function(component, event, helper) {
        helper.focusHelper(component, event);
    },
    
})
