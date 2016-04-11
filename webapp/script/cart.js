/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global product */

var NUMBER = 0;
var itemPrice;
var item;
var productCache;
var isFish = true;
var loadedPageID;
var lastUpdatedTime = 0;
var filter = "all";

function onBodyLoaded() {
    $(document).on("pageshow", "#productPage", function () {
        if (productCache == null) {
            $.mobile.loading('show');
        } else {
            // loadProducts(productCache);
        }

    });
    $(document).on("pageshow", "#popupInfo", function () {
        var product = getSelectedProduct(item);
        if (product == null) {
            window.location = "../cart/listProducts.jsp"
            return;
        }
        enableImmediate(product);
    });
    $(document).on("pagechange", function (e, data) {
        loadedPageID = data.toPage[0].id;
    });
    $("#popupInfo").change(function () {
        var slider_value = $("#quantity-step").val();
        $("#amountText").val(itemPrice * slider_value);
        var discount = $("#amountText").val() * .95;
        discount = discount.toFixed(0);
        $("#dPrice").val(discount);


    });
    configureHeader();
    initProducts();
    //runMigration();
    $("input[name='timing']").bind("change", function (event, ui) {
        computeDiscount(event, ui);
    });
    $("input[name='filter']").bind("change", function (event, ui) {
        filter = event.target.id;
        if (productCache != null) {
            loadProducts(productCache);
        }
    });

}

function configureHeader() {
    if (isAndroid() && !Android.appVersion) {
        $("#mainHeader").hide(true);
    }
    if (isAndroid()) {
        $("#userinfo").hide(true);
    } else {
        $("#phone").val(getNumberFromBrowser());
    }

}

function runMigration(){
    if(!isAndroid()) return;
    var identity = getIdentity();
    if(identity==null||identity==""){
        var url = "api/generatePassword/"+getNumber();
        $.ajax({
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Cache-Control", "no-cache");
        }, //Show spinner
        complete: function () {
        }, //Hide spinner
        url: url,
        success: function (responseText) {
            var status = responseText.split(":")[0];
            if(status=="SUCCESS"){  
                var identity = responseText.split(":")[1];
                saveIdentity(identity);
            }
        },
    });
    }else{
        
    }
}
function fetchMenuItems(){
    
}
function isAndroid() {
    try {
        Android;
        return true;
    } catch (e) {
        return false;
    }
}
function createDom(product) {
    var linkInformation = "<li id='" + product.name + "'><a class='item-link' href='#popupInfo' data-transition='flip' onClick=\"setPrice(" + product.sellingPrice + ", '" + product.name + "');\"> ";
    var image = "<img src='" + product.pic + "'>";
    var title = '<h1 class="myHeader">' + product.displayName + '</h1>';
    var price = '<div class="myParagraph">' +
            '<div class="row">' +
            getPriceDom(product.marketPrice, product.sellingPrice) +
            '</div>' +
            '</div>';
    var size = '<div class="size"><span>' + product.sizeSpecification + '</span></div>';
    if (product.bookingOnly == true) {
        size += '<div class="size"><span><b>' + 'Only booking avaiable' + '</b></span></div>';
    }

    var closingTags = "</a></li>";
    return linkInformation + image + title + price + size + closingTags;

}
function getPriceDom(mPrice, sPrice) {
    var priceDom = '<span class="offer-price">Rs.' + sPrice + '</span>';
    if (mPrice !== sPrice) {
        priceDom = '<span class="actual-price">Rs.' + mPrice + '</span>&nbsp;' + priceDom;
    }
    return priceDom;
}
function validateNumber() {
    if (!isAndroid()) {
        var no = $("#phone").val();
        if (no == null || no.toString().length != 10) {
            alert("Invalid phone number");
            return false;
        }
        return true;
    }
    return true;
}
function saveNumberInBrowser(no) {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("number", no);
    }
}
function getNumberFromBrowser() {
    if (typeof (Storage) !== "undefined") {
        return localStorage.getItem("number");
    } else {
        return "";
    }
}
function validateContext() {
    if (item == null) {
        $.mobile.back();
    }
}
function placeOrder() {
    validateContext();
    if (!validateNumber())
        return;
    var quantity = $("#quantity-step").val();
    var no = getNumber();
    if (!isAndroid()) {

        no = $("#phone").val();
        saveNumberInBrowser(no);
    }
    var immediate = true;
    if (isFish) {
        immediate = !($("#lLater").hasClass("ui-radio-on"));
    }
    var url = "api/placeOrder?number=" + no + "&product=" + item + "&quantity=" + quantity + "&immediate=" + immediate;
    var appender = new Date().getTime();
    url += "&appender=" + appender;
    $.ajax({
        type: 'POST',
        beforeSend: function (request) {
            $.mobile.loading('show');
            request.setRequestHeader("Cache-Control", "no-cache");
        }, //Show spinner
        complete: function () {
            $.mobile.loading('hide');
        }, //Hide spinner
        url: url,
        error: function (response) {
            orderResponse("Not able to place the order.Please check the internet connection. You can contact us on 9605657736 if the issue persist", true);
        },
        success: function (response) {
            
            if(response.split(":")[0]=="SUCCESS"){
                var history = new OrderHistory();
                history.addItem(response.split(":")[1]);
                $("#successMessage").popup("open");
                orderResponse("Your order is placed successfully");
                history.getOrders();
            }
        },
    });

}
function shouldRefresh() {
    var now = getCurrentTime();
    return (now - lastUpdatedTime) > 500
}
var initTimer = 0;
function initProducts() {
    if (!shouldRefresh()) {
        if (initTimer != 0) {
            clearTimeout(initTimer);
            initTimer = setTimeout(initProducts, 1000 * 60 * 11);
            return;
        }
    }
    var xhttp;
    xhttp = new XMLHttpRequest();
    var appender = new Date().getTime();
    var url = "api/product/list?number=" + getNumber() + "&" + appender;
    $.ajax({
        beforeSend: function () {
            if (loadedPageID != "entryPage") {
                $.mobile.loading('show');
            }
        }, //Show spinner
        complete: function () {
            $.mobile.loading('hide');
            initTimer = setTimeout(initProducts, 1000 * 60 * 10);
            lastUpdatedTime = getCurrentTime();
        }, //Hide spinner
        url: url,
        dataType: 'json',
        error: function () {
            handeNetworkError();
        }
        ,
        success: function (response) {
            loadProducts(response);
            (new OrderHistory()).getOrders();
        },
    });

}
function handeNetworkError() {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>Network Issue, Trying to reload</h1></div>")
            .css({"display": "block", "opacity": 1, "top": $(window).scrollTop() + 100})
            .appendTo($.mobile.pageContainer)
            .delay(3000)
            .fadeOut(2000, function () {
                $(this).remove();
            });
    setTimeout(initProducts, 5);
}
function isOnlyBooking(product) {
    if (product.bookingOnly == true) {
        $("#now").parent().hide(true);
        $('#later').trigger("click").trigger("click");
        return true;
    }
    return false;
}
function enableImmediate(product) {
    if (isOnlyBooking(product)) {
        return;
    }
    if (isFish) {
        $("#now").parent().show(true);
        $('#now').trigger("click").trigger("click");
        $("#dBox").hide(true);
    }
}
function computeDiscount(e, u) {
    var needDiscount = e.target.id == "later";
    if (needDiscount) {
        $("#dBox").show(true);
        $("#tip").hide(true);
        var discount = $("#amountText").val() * .95;
        discount = discount.toFixed(0);
        $("#dPrice").val(discount);
    } else {
        $("#dBox").hide(true);
        $("#tip").show(true);
    }
}
function setPrice(price, itemName) {
    itemPrice = price;
    item = itemName;
    document.getElementById("orderButton").disabled = false;
    $("#response").text("");
    $("#quantity-step").val(1);

    $("#amountText").val(price);
    var product = getSelectedProduct(itemName);
    // enableImmediate(product);
    $("#productName").text(product.displayName);
    $("#productPrice").val(product.sellingPrice);
    $('#productPrice').textinput({theme: "c"});
}
function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);
    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

function show(id, value) {
    // document.getElementById(id).style.display = value ? 'block' : 'none';
}

onReady(function () {
    show('page', true);
    show('loading', false);
});
function orderResponse(response, isError) {
    $("#response").html(response);
    if (!isError) {
        //goes wrong with safar mobile sometimes
        document.getElementById("orderButton").disabled = true;
    }
}
function getCurrentTime() {
    //time in seconds;
    return Math.round(Date.now() / 1000);
}
function loadProducts(products) {
    if (products == null)
        return;
    if (isFish) {
        $("#filterPanel").show(true);
    } else {
        $("#filterPanel").hide(true);
    }
    $("#productList").empty();
    var i = 0;
    productCache = products;
    for (i = 0; i < products.length; i++) {
        if (!isFish && products[i].type === "MEAT") {
            $("#productList").append(createDom(products[i]));
        }
        else if (isFish && products[i].type === "FISH") {
            handleFish(products[i]);
        }
    }

    forceRefresh();
}
function handleFish(product) {
    var all = filter == "all";
    if (all) {
        $("#productList").append(createDom(product));
        return;
    }
    var regular = filter == "regular";
    var premium = filter == "premium";
    var type = fishCostType(product);
    if (regular && type == "regular") {
        $("#productList").append(createDom(product));
    } else if (premium && type == "premium") {
        $("#productList").append(createDom(product));
    }
}
function fishCostType(product) {
    return product.marketPrice > 299 ? "premium" : "regular";
}
function getSelectedProduct(name) {
    for (i = 0; i < productCache.length; i++) {
        if (productCache[i].name === name) {
            return productCache[i];
        }
    }
}

function getNumber() {
    if (!isAndroid()) {
        return getNumberFromBrowser();
    }
    try {
        return Android.getNumber();
    } catch (error) {
        return "";
    }
}
function forceRefresh() {
    try {
        $("#productList").listview("refresh");
    } catch (error) {
        return;
    }
}
var OrderHistory = function(){
    
}
OrderHistory.prototype.addItem = function(value){
    var history = this.getHistory();
    var currentTime = new Date().getTime();
    if(history==null){
        history={};
        history["items"]=[];
    }else{
        var lastOrderTime = this.lastOrderTime();
        var timeDiff = timeDiffInMins(currentTime,lastOrderTime);
        if(timeDiff>90){
            history["items"] = [];
        }
    }
    history["items"].push(value);
    history["time"] = currentTime;
    this.setHistory(history)
}
OrderHistory.prototype.lastOrderTime = function(){
    var history = this.getHistory();
    if(history!=null){
        return history["time"];
    }
    else{
        return -1;
    }
}
OrderHistory.prototype.getHistory = function(){
    var history;
    if(isAndroid()){
        history = Android.readValue("history");
    }else{
        history = localStorage.getItem('history');        
    }
    if(history==null||history==""){
        return null;
    }
    return JSON.parse(history);
}

OrderHistory.prototype.setHistory = function(history){
    var object = JSON.stringify(history);
    if(isAndroid()){
       Android.saveKeyValue("history",object); 
    }else{
        localStorage.setItem("history",object);    
    }
}
OrderHistory.prototype.getOrders = function(){
    var history = this.getHistory();
    if(history==null){
        return null;
    }
    var items = history["items"].join(",");
    var appender = new Date().getTime();
    var url = "api/orders/details?items=" +items+ "&"+appender;
    $.ajax({
        url: url,
        dataType: 'json',
        error: function () {
            //handle
        }
        ,
        success: function (response) {
            populateOrderMenu(response);
        },
    });

    
}
function populateOrderMenu(response){
    $("#mUserName").html(response.user.name);
    var lastOrders = response.orders;
    var grandTotal =0;
    $("#mOrderMenu").html("");
    $("#navpanelInner").html("");
    $("#orderSubmenu").hide();
    for(var i=0;i<lastOrders.length;i++){
        var line = $("#mProductName").clone();
        var product = getProduct(lastOrders[i].product);
        if(product==null){
            continue;
        }
        var genId = "mProductName"+lastOrders[i].orderId;
        line[0].id=genId;
        line.find("#mItem").text(product.displayName+" :")
        var quantity = lastOrders[i].quantity;
        var price = product.sellingPrice;
        var total = quantity*price;
        grandTotal+=total;
        var dtString = ""+quantity+" * "+price+" = "+total;
        line.find("#mDetails").text(dtString);
        $("#mOrderMenu").append(line);
    }
   
    if(grandTotal!=0){
        $("#orderSubmenu").show();
        $("#mTotal").text("Rs. "+grandTotal);
    }
     $("#navpanelInner").html($("#navpanel").html());
    
}
function getProduct(id){
     for (i = 0; i < productCache.length; i++) {
         if(productCache[i].name==id){
             return productCache[i];
         }
     }
     return null;
}
function timeDiffInMins(t1,t2){
    var diff = t1-t2;
    return  Math.floor(diff/1000/60);
}