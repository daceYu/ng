"use strict";angular.module("app",["ui.router","ngCookies","validation"]),angular.module("app").value("dict",{}).run(["dict","$http",function(t,e){e.get("data/city.json").then(function(e){t.city=e.data}),e.get("data/salary.json").then(function(e){t.salary=e.data}),e.get("data/scale.json").then(function(e){t.scale=e.data})}]),angular.module("app").config(["$provide",function(t){t.decorator("$http",["$delegate","$q",function(t,e){var n=t.get;return t.post=function(t,a,i){var o=e.defer();return n(t).then(function(t){o.resolve(t)}).catch(function(t){o.reject(t)}),{then:function(t){o.promise.then(t)},catch:function(t){o.promise.then(null,t)}}},t}])}]),angular.module("app").config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("main",{url:"/main",templateUrl:"view/main.html",controller:"mainCtrl"}).state("position",{url:"/position/:id",templateUrl:"view/position.html",controller:"positionCtrl"}).state("company",{url:"/company/:id",templateUrl:"view/company.html",controller:"companyCtrl"}).state("search",{url:"/search",templateUrl:"view/search.html",controller:"searchCtrl"}).state("login",{url:"/login",templateUrl:"view/login.html",controller:"loginCtrl"}).state("register",{url:"/register",templateUrl:"view/register.html",controller:"registerCtrl"}).state("me",{url:"/me",templateUrl:"view/me.html",controller:"meCtrl"}).state("favorite",{url:"/favorite",templateUrl:"view/favorite.html",controller:"favoriteCtrl"}).state("post",{url:"/post",templateUrl:"view/post.html",controller:"postCtrl"}),e.otherwise("main")}]),angular.module("app").config(["$validationProvider",function(t){var e={phone:/^1[\d]{10}$/,password:function(t){return(t+"").length>5},required:function(t){return!!t}},n={phone:{success:"",error:"必须是11位数字的手机号"},password:{success:"",error:"长度至少为6位"},required:{success:"",error:"不能为空"}};t.setExpression(e).setDefaultMsg(n)}]),angular.module("app").controller("companyCtrl",["$http","$state","$scope",function(t,e,n){t.get("data/company.json?id="+e.params.id).then(function(t){n.company=t.data}).catch(function(t){console.log(t)})}]),angular.module("app").controller("favoriteCtrl",["$http","$scope",function(t,e){t.get("data/myFavorite.json").then(function(t){e.favoriteList=t.data})}]),angular.module("app").controller("loginCtrl",["$http","$state","cache","$scope",function(t,e,n,a){a.submit=function(){t.post("data/login.json",a.user).then(function(t){n.put("login.id",t.data.id),n.put("login.name",t.data.name),n.put("login.image",t.data.image),e.go("main")})}}]),angular.module("app").controller("mainCtrl",["$http","$scope",function(t,e){t.get("./data/positionList.json").then(function(t){e.list=t.data}).catch(function(t){console.log(t)})}]),angular.module("app").controller("meCtrl",["cache","$state","$scope",function(t,e,n){t.get("login.name")&&(n.name=t.get("login.name"),n.imgPath=t.get("login.image")),n.logout=function(){t.remove("login.id"),t.remove("login.image"),t.remove("login.name"),e.go("main")}}]),angular.module("app").controller("positionCtrl",["$q","$http","$state","cache","$scope",function(t,e,n,a,i){function o(t){e.get("data/company.json?id="+t).then(function(t){i.company=t.data}).catch(function(t){console.log(t)})}i.isLogin=a.get("login.name")||"",i.message=i.isLogin?"投个简历":"登陆",function(){var a=t.defer();return e.get("data/position.json?id="+n.params.id).then(function(t){i.position=t.data,t.data.posted&&(i.message="已投递"),a.resolve(t.data)}).catch(function(t){a.reject(t)}),a.promise}().then(function(t){o(t.companyId)}),i.go=function(){"已投递"!==i.message&&(i.isLogin?i.message="已投递":n.go("login"))}}]),angular.module("app").controller("postCtrl",["$http","$scope",function(t,e){e.itemList=[{id:"all",name:"全部"},{id:"pass",name:"面试邀请"},{id:"fail",name:"不合适"}],t.get("data/myPost.json").then(function(t){e.list=t.data}),e.filterObj={},e.itemClick=function(t,n){switch(t){case"all":delete e.filterObj.state;break;case"pass":e.filterObj.state="1";break;case"fail":e.filterObj.state="-1"}}}]),angular.module("app").controller("registerCtrl",["$http","$interval","$state","$scope",function(t,e,n,a){a.submit=function(){t.post("data/regist.json",a.user).then(function(t){alert("注册成功，无后台，请使用默认账号登录"),n.go("login")})},a.send=function(){var n=60;t.get("data/code.json").then(function(t){if(a.time="60s",200==t.status)var i=e(function(){if(n<=0)return e.cancel(i),void(a.time="");n--,a.time=n+"s"},1e3)})}}]),angular.module("app").controller("searchCtrl",["dict","$http","$scope",function(t,e,n){n.name="",n.search=function(){e.get("./data/positionList.json?name="+n.name).then(function(t){n.positionList=t.data}).catch(function(t){console.log(t)})},n.search(),n.itemList=[{id:"city",name:"城市"},{id:"salary",name:"薪水"},{id:"scale",name:"公司规模"}],n.filterObj={};var a="";n.itemClick=function(e,i){a=e,n.dic=t[e],n.visib=!0},n.sClick=function(t,e){t?(angular.forEach(n.itemList,function(t){t.id===a&&(t.name=e)}),n.filterObj[a+"Id"]=t):(delete n.filterObj[a+"Id"],angular.forEach(n.itemList,function(t){if(t.id===a)switch(t.id){case"city":t.name="城市";break;case"salary":t.name="薪资";break;case"scale":t.name="公司规模"}}))}}]),angular.module("app").directive("appCompany",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/company.html",scope:{comp:"="}}}]),angular.module("app").directive("appFoot",["cache","$state",function(t,e){return{restrict:"A",replace:!0,templateUrl:"view/template/foot.html"}}]),angular.module("app").directive("appHead",["cache",function(t){return{restrict:"A",replace:!0,templateUrl:"view/template/head.html",link:function(e){e.name=t.get("login.name")||""}}}]),angular.module("app").directive("appHeadBar",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/headBar.html",scope:{title:"@"},link:function(t){t.back=function(){window.history.back()}}}}]),angular.module("app").directive("appPositionClass",[function(){return{restrict:"A",replace:!0,scope:{comp:"="},templateUrl:"view/template/positionClass.html",link:function(t){t.showPosition=function(e){t.positionList=t.comp.positionClass[e].positionList,t.isActive=e},t.$watch("comp",function(e){e&&t.showPosition(0)})}}}]),angular.module("app").directive("appPositionInfo",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/positionInfo.html",scope:{isActive:"=",isLogin:"=",pos:"="},link:function(t){t.$watch("pos",function(e){e&&(t.pos.select=t.pos.select||!1,t.imgPath=t.pos.select?"images/star-active.png":"images/star.png")}),t.favorite=function(e){t.pos.select=!t.pos.select,t.imgPath=t.pos.select?"images/star-active.png":"images/star.png"}}}}]),angular.module("app").directive("appPositionList",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/positionList.html",scope:{data:"=",filterObj:"=",isFavorite:"="},link:function(t){t.select=function(t){t.select=!t.select}}}}]),angular.module("app").directive("appSheet",function(){return{restrict:"A",replace:!0,templateUrl:"view/template/sheet.html",scope:{list:"=",visible:"=",slc:"&"}}}),angular.module("app").directive("appTab",function(){return{restrict:"A",replace:!0,templateUrl:"view/template/tab.html",scope:{list:"=",xcli:"&"},link:function(t){t.selectId="city",t.click=function(e){t.selectId=e.id,t.xcli(e)}}}}),angular.module("app").filter("filterByObj",[function(){return function(t,e){var n=[];return angular.forEach(t,function(t){var a=!0;for(var i in e)t[i]!==e[i]&&(a=!1);a&&n.push(t)}),n}}]),angular.module("app").service("cache",["$cookies",function(t){this.put=function(e,n){t.put(e,n)},this.get=function(e){return t.get(e)},this.remove=function(e){t.remove(e)}}]);