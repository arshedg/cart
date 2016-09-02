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
var isMeat = false;
var isCook = false;
var isFood = false;
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
        setSliderAndAmount();
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
    hideDeliveryCharges();
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

function runMigration() {
    if (!isAndroid())
        return;
    var identity = getIdentity();
    if (identity == null || identity == "") {
        var url = "api/generatePassword/" + getNumber();
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
                if (status == "SUCCESS") {
                    var identity = responseText.split(":")[1];
                    saveIdentity(identity);
                }
            },
        });
    } else {

    }
}
function fetchMenuItems() {

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
    var linkInformation = "<li class='Container' id='" + product.name + "' onClick=\"setPrice(" + product.sellingPrice + ", '" + product.name + "');\"> <a href='#popupInfo'> ";
    var image = "<img class='PImage' src='" + "api/product/image/large?name=" + product.name + "'>";
    var title = '<div class="PHeader">' + product.displayName + ':&nbsp;';
    var size = '<span class="PDetails">' + product.sizeSpecification + '</span></div>';
    var price = '<div class="priceBoard">₹' + computePrice(product.sellingPrice) + '</div>';

    if (product.bookingOnly == true) {
        size += '<div class="size"><span><b>' + 'Only booking avaiable' + '</b></span></div>';
    }

    var closingTags = "</a></li>";
    return linkInformation + image + title + size + price + closingTags;

}
function computePrice(mPrice) {
    var spec = new DefaultStep();
    if (isCook) {
        spec = new CookStep();
    } else if (isFood) {
        spec = new FoodStep();
    }

    var computedPrice = spec.initialStep * mPrice;
    return computedPrice;
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
function hideDeliveryCharges(){
      
       $("#warning").hide();
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
    var slot = $("input[name='timing']:checked").siblings()[0].textContent;
    var url = "api/placeOrder?number=" + no 
            + "&product=" + item + 
            "&quantity=" + quantity + 
            "&immediate=" + immediate +
            "&slot=" +slot;
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

            if (response.split(":")[0] == "SUCCESS") {
                var history = new OrderHistory();
                history.addItem(response.split(":")[1]);
                $("#successMessage").popup("open");
                orderResponse("Your order is placed successfully");
                history.getOrders();
                gpsHanler = new GPS();
                gpsHanler.saveLocation();
            } else {
                orderResponse(response, true);
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
           
        }, //Hide spinner
        url: url,
        dataType: 'json',
        error: function () {
            handeNetworkError();
        }
        ,
        success: function (response) {
            initTimer = setTimeout(initProducts, 1000 * 60 * 10);
            lastUpdatedTime = getCurrentTime();
            loadProducts(response);
            (new OrderHistory()).getOrders();
        },
    });

}
function handeNetworkError() {
    $("<div style='background-color:white;margin:auto;position:absolute;top:0;left:0;right:0' class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>Network Issue, Trying to reload...<br/>Please check your internet connection</h1></div>")
            .css({"display": "block", "opacity": 1, "top": $(window).scrollTop() + 100})
            .appendTo($.mobile.pageContainer)
            .delay(3000)
            .fadeOut(2000, function () {
                $(this).remove();
            });
    $.mobile.loading('show');
    setTimeout(initProducts, 1000);
}
function isOnlyBooking(product) {
    if (product.bookingOnly == true) {
        $("#now").parent().hide(true);
        $('#later').trigger("click").trigger("click");
        return true;
    }
    return false;
}
function timingHtml(id,label){
    var emergency="";
    if(label.match("Emergency")){
        emergency="emergency=\"true\"";
    }
    if(label.match("Immediate")){
        emergency="immediate=\"true\"";
    }
    var inp = '<input  type="radio" name="timing" id="'+id+'" value="on" checked="checked"'+emergency+'>'
    var name = '<label class="ui-mini"  for="'+id+'">'+label+'</label>';
    return inp+name;
}
function showDeliveryCharge(e,u){
    if(e.currentTarget.attributes["emergency"]){
        $("#tip").hide();
        $("#warning").show();
         $("#dBox").hide();
    }
    else if(e.currentTarget.attributes["immediate"]){
         $("#tip").hide();
        $("#warning").hide();
         $("#dBox").hide();
    }
    else{
        $("#tip").hide();
        $("#warning").hide();
         $("#dBox").hide();
    }

}

function enableImmediate(product) {
    var slots = new Slot().getSlots();
     $("#timingControler").controlgroup("container").empty();
    for(var i=0;i<slots.length;i++){
        $("#timingControler").controlgroup("container").append(timingHtml("slot"+i,slots[i]));
    }
    $("#timingControler").enhanceWithin().controlgroup("refresh");

    $('#slot0').trigger("click").trigger("click");
    $("input[name='timing']").bind("change", function (event, ui) {
        showDeliveryCharge(event, ui);
    });
}
function setSliderAndAmount() {
    var sValue = new DefaultStep();
    if (isCook) {
        sValue = new CookStep();
    }
    if (isFood) {
        sValue = new FoodStep();
    }
    var slider = $("#quantity-step");
    slider.attr("max", sValue.maxStep);
    slider.attr("min", sValue.minStep);
    slider.attr("step", sValue.stepSize);
    slider.val(sValue.initialStep).slider("refresh");
    $("#productPrice").val(itemPrice * sValue.initialStep);
    $("#unitDescription").html(sValue.unitDescription);
    $("#amountText").val(itemPrice * sValue.initialStep);
}
function computeDiscount(e, u) {
    var needDiscount = e.target.id == "later";
    if (needDiscount && isFish) {
        $("#dBox").show(true);
        $("#tip").hide();
        var discount = $("#amountText").val() * .95;
        discount = discount.toFixed(0);
        $("#dPrice").val(discount);
    } else {
        $("#dBox").hide(true);
        $("#tip").hide();
    }
    if (!isFish) {
        $("#dBox").hide(true);
        $("#tip").hide();
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

    $("#innerImage").attr("src", "api/product/image/large?name=" + itemName);
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
function setType(type) {
    if (type == "FISH") {
        isFish = true;
        isMeat = false;
        isCook = false;
        isFood = false;
    } else if (type == "MEAT") {
        isFish = false;
        isMeat = true;
        isCook = false;
        isFood = false;
    } else if (type == "COOK") {
        isFish = false;
        isMeat = false;
        isCook = true;
        isFood = false;
    } else if (type == "FOOD") {
        isFish = false;
        isMeat = false;
        isCook = false;
        isFood = true;
    }
}
function loadProducts(products) {
    if (products == null)
        return;
    if (isFish) {
        $("#filterPanel").show(true);
    } else {
        $("#filterPanel").hide(true);
    }
    $("#productList").empty();//todo
    var i = 0;
    productCache = products;
    for (i = 0; i < products.length; i++) {
        if (isMeat && products[i].type === "MEAT") {
            $("#productList").append(createDom(products[i]));
        } else if (isCook && products[i].type === "COOK") {
            $("#productList").append(createDom(products[i]));
        }
        else if (isFood && products[i].type === "FOOD") {
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
function goBack() {
    window.history.back();
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

var CookStep = function () {
    this.initialStep = 12;
    this.minStep = 12;
    this.maxStep = 48;
    this.stepSize = 6;
    this.unitDescription = "Price per Dozen(12 pieces)";

}
var FoodStep = function () {
    this.initialStep = 1;
    this.minStep = 1;
    this.maxStep = 10;
    this.stepSize = 1;
    this.unitDescription = "Price per unit";

}
var DefaultStep = function () {
    this.initialStep = .5;
    this.minStep = .5;
    this.maxStep = 5;
    this.stepSize = .5;
    this.unitDescription = "Price per 500gms:";

}
var OrderHistory = function () {

}
OrderHistory.prototype.addItem = function (value) {
    var history = this.getHistory();
    var currentTime = new Date().getTime();
    if (history == null) {
        history = {};
        history["items"] = [];
    } else {
        var lastOrderTime = this.lastOrderTime();
        var timeDiff = timeDiffInMins(currentTime, lastOrderTime);
        if (timeDiff > 90) {
            history["items"] = [];
            history.rated=false;
        }
    }
    history["items"].push(value);
    history["time"] = currentTime;
    this.setHistory(history)
}
OrderHistory.prototype.askForRating = function () {
    var history = this.getHistory();
    if (history == null) {
        return;
    }
    if (history.rated == true) {
        return;
    }
    var lstTime = this.lastOrderTime();
    var currentTime = new Date().getTime()
    var timeDiff = timeDiffInMins(currentTime, lstTime);
    if (timeDiff > 60 * 12) {//after 12 hours
        $.mobile.changePage("#rating");
    }
}
OrderHistory.prototype.rated = function(){
    var history = this.getHistory();
    history.rated=true;
    this.setHistory(history);
}
OrderHistory.prototype.lastOrderTime = function () {
    var history = this.getHistory();
    if (history != null) {
        return history["time"];
    }
    else {
        return -1;
    }
}
OrderHistory.prototype.getHistory = function () {
    var history;
    if (isAndroid()) {
        history = Android.readValue("history");
    } else {
        history = localStorage.getItem('history');
    }
    if (history == null || history == "") {
        return null;
    }
    return JSON.parse(history);
}

OrderHistory.prototype.setHistory = function (history) {
    var object = JSON.stringify(history);
    if (isAndroid()) {
        Android.saveKeyValue("history", object);
    } else {
        localStorage.setItem("history", object);
    }
}
OrderHistory.prototype.getOrders = function () {
    var history = this.getHistory();
    if (history == null) {
        return null;
    }
    var items = history["items"].join(",");
    var appender = new Date().getTime();
    var url = "api/orders/details?items=" + items + "&" + appender;
    $.ajax({
        url: url,
        dataType: 'json',
        error: function () {
            //handle
        }
        ,
        success: function (response) {
            populateOrderMenu(response);
            new OrderHistory().askForRating();
        },
    });


}
function populateOrderMenu(response) {
    if(response.user){
        $("#mUserName").html(response.user.name);
        $("#balance").html(response.user.credit);
    }
    var lastOrders = response.orders;
    var grandTotal = 0;
    $("#mOrderMenu").html("");
    $("#navpanelInner").html("");
    $("#orderSubmenu").hide();
    for (var i = 0; i < lastOrders.length; i++) {
        var line = $("#mProductName").clone();
        var product = getProduct(lastOrders[i].product);
        if (product == null) {
            continue;
        }
        var genId = "mProductName" + lastOrders[i].orderId;
        line[0].id = genId;
        line.find("#mItem").text(product.displayName + " :")
        var quantity = lastOrders[i].quantity;
        var price = product.sellingPrice;
        var total = quantity * price;
        grandTotal += total;
        var dtString = "" + quantity + " * " + price + " = " + total;
        line.find("#mDetails").text(dtString);
        $("#mOrderMenu").append(line);
    }

    if (grandTotal != 0) {
        $("#orderSubmenu").show();
        $("#mTotal").text("Rs. " + grandTotal);
    }
    $("#navpanelInner").html("");
    $("#navpanelInner").html($("#navpanel").html());


}
function getProduct(id) {
    for (i = 0; i < productCache.length; i++) {
        if (productCache[i].name == id) {
            return productCache[i];
        }
    }
    return null;
}
function timeDiffInMins(t1, t2) {
    var diff = t1 - t2;
    return  Math.floor(diff / 1000 / 60);
}
var GPS = function () {

}
var Slot=function(){
   

   
}
Slot.prototype.getSlots = function(){
    var date = new Date();
    var hour = date.getHours();
    var tommorow = "<br/><span style='font-size:x-small' class='ui-mini'>tomorrow</span>";
    var today = "<br/><span style='font-size:x-small' class='ui-mini'>today</span>";
    var from7="7:00am-9:00am";
    var from10 = "10:00am-12:30pm";
    var from5 = "5:00pm-8:00pm";
    var emergency = "Emergency Delivery<br/><span style='font-size:x-small' class='ui-mini'>Within 60 mins or it's free</span>";
    if(isFood&&hour>10&&hour<=21){
        return ["Immediate"];
    }else if(isFood&&hour<=10){
        return ["12:00pm-1:00pm"];
    }else if(isFood&&hour>21){
        return ["12:00pm-1:00pm"+tommorow];
    }
    if(hour>=17&&hour<21){
        return [from7+tommorow,
                from10+tommorow,
                from5+tommorow,
                emergency];
    }
    if(hour>=21){
        return ["7:00am-9:00am"+tommorow,
                "10:00am-12:30pm"+tommorow,
                "5:00pm-8:00pm"+tommorow];
    }
    if(hour<=5){
        return ["7:00am-9:00am"+today,
                "10:00am-12:30pm"+today,
                "5:00pm-8:00pm"+today];
    }
    if(hour<10){
        return [from10+today,
                from5+today,
                from7+tommorow,
               emergency];
    }
    
    if(hour<17){
        return [from5+today,
            from7+tommorow,
            from10+tommorow,
            from5+tommorow,
            emergency];
    }
}
GPS.prototype.saveLocation = function () {
    try {
        navigator.geolocation.getCurrentPosition(handleGps);
    }
    catch (e) {

    }
}
function handleGps(position) {
    var url = "api/user/location?gps=" + position.coords.latitude + "," + position.coords.longitude
            + "&number=" + getNumber();
    $.ajax({
        url: url,
        type: 'GET',
        success: function (response) {

        },
    });
}

function Feedback() {
    var number;
    var productRating;
    var deliveryRating;
    var comment;
    var relatedOrder;
}

function saveFeedback(pRating, dRating, message) {
    var feedback = new Feedback();
    feedback.number = getNumber();
    feedback.productRating = pRating;
    feedback.deliveryRating = dRating;
    feedback.comment = message;
    var history = new OrderHistory().getHistory();
    if (history == null) {
        window.history.back();
        return;
    }
    feedback.relatedOrder = history.items[0];
    var json = JSON.stringify(feedback);
    var url = "api/feedback";

    $.ajax({
        url: url,
        type: 'POST',
        data: json,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        complete: function (data) {
           new OrderHistory().rated();
           
        }
    });
    $.mobile.changePage("#");
}
function submitFeedback(src) {
    var delivery = document.querySelector('input[name="dRating"]:checked');
    var product = document.querySelector('input[name="qRating"]:checked');
    if (delivery == null || product == null) {
        $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>Please provide rating.</h1></div>")
                .css({"display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100})
                .appendTo($.mobile.pageContainer)
                .delay(800)
                .fadeOut(400, function () {
                    $(this).remove();
                });
        return;
    }
    var message = $("#feedbackMessage").val();
    saveFeedback(product.value, delivery.value, message);

}