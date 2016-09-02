<%-- 
    Document   : listProducts
    Created on : 20 Nov, 2015, 7:08:37 PM
    Author     : arsh
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Available products</title>
        <link rel="stylesheet" href="//code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css">
        <link rel="stylesheet" href="css/product.css">

        <script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
        <script src="//code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
        <script src="script/login.js"></script>
        <script src="script/cart.js?<%=System.currentTimeMillis()%>"></script>
        <script>
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-73360757-1', 'auto');
            ga('send', 'pageview');

        </script>
        <style>
            .rating {
                float:left;
            }

            /* :not(:checked) is a filter, so that browsers that don’t support :checked don’t 
               follow these rules. Every browser that supports :checked also supports :not(), so
               it doesn’t make the test unnecessarily selective */
            .rating:not(:checked) > input {
                position:absolute;
                top:-9999px;
                clip:rect(0,0,0,0);
            }

            .rating:not(:checked) > label {
                float:right;
                width:1em;
                padding:0 .1em;
                overflow:hidden;
                white-space:nowrap;
                cursor:pointer;
                font-size:200%;
                line-height:1.2;
                color:#ddd;
                text-shadow:1px 1px #bbb, 2px 2px #666, .1em .1em .2em rgba(0,0,0,.5);
            }

            .rating:not(:checked) > label:before {
                content: '★ ';
            }

            .rating > input:checked ~ label {
                color: #f70;
                text-shadow:1px 1px #c60, 2px 2px #940, .1em .1em .2em rgba(0,0,0,.5);
            }

            .rating:not(:checked) > label:hover,
            .rating:not(:checked) > label:hover ~ label {
                color: gold;
                text-shadow:1px 1px goldenrod, 2px 2px #B57340, .1em .1em .2em rgba(0,0,0,.5);
            }

            .rating > input:checked + label:hover,
            .rating > input:checked + label:hover ~ label,
            .rating > input:checked ~ label:hover,
            .rating > input:checked ~ label:hover ~ label,
            .rating > label:hover ~ input:checked ~ label {
                color: #ea0;
                text-shadow:1px 1px goldenrod, 2px 2px #B57340, .1em .1em .2em rgba(0,0,0,.5);
            }

            .rating > label:active {
                position:relative;
                top:2px;
                left:2px;
            }
            #side-menu-button {
                left: auto;
                right: 0;
            }
            #side-menu {
                position: fixed;
                top: 50px;
                right: 0;
                left: auto;
                bottom: 0;
                width: 70%;
                max-width:100px;
                z-index: 10000;
                background: #fff;
                opacity: 0.95;
            }

            #filterPanel .ui-radio {
                width: 90px;
                text-align: center;
            }

            #filterPanel label {
                text-align: center;
            }
            .ui-panel-inner {
                padding:0px; /*make the buttons flush edge to edge*/
            }
            .ui-controlgroup {
                margin:0; /*make the buttons flush to the top*/
            }
            .side-menu-item {
                margin:5px;

            }
            #header {
                height:54px;
            }
            #bars-button {
                margin-top:0px;
            }
            .menu-button {
                float: left;
                width: 45%;
                display: block;
                padding-left: 0px;
                padding-right: 0px;
            }

            .BoxParent{
                list-style-type:none;
                padding-left:5px;
            }
            .Container{
                width:100%;
                max-width:500px;
                height:100%;
                border-style: solid;
                border-color:#f6f6f6;
                margin-bottom:5px;
                background-color: white;
                position: relative;
            }
            .PImage{  
                width:100%;
                height:100%;
                max-height:220px;
            }
            .PHeader{
                float:center;
                position:absolute;
                opacity: 0.9;
                left:0;
                bottom:2px;
                background-color: white;
                font-weight: bold;
                padding:5px;

            }
            .PDetails{  
                font-weight: lighter;
                color:black;

            }

            .priceBoard {
                position: absolute;
                top: 2px;
                right:2px;
                margin:2px;
                opacity: 0.85;
                -moz-box-shadow: 0px 1px 0px 0px #0f6d96;
                -webkit-box-shadow: 0px 1px 0px 0px #0f6d96;
                box-shadow: 0px 1px 0px 0px #0f6d96;
                background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #01a0da), color-stop(1, #01a0da));
                background:-moz-linear-gradient(top, #01a0da 5%, #01a0da 100%);
                background:-webkit-linear-gradient(top, #01a0da 5%, #01a0da 100%);
                background:-o-linear-gradient(top, #01a0da 5%, #01a0da 100%);
                background:-ms-linear-gradient(top, #01a0da 5%, #01a0da 100%);
                background:linear-gradient(to bottom, #01a0da 5%, #01a0da 100%);
                filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#01a0da', endColorstr='#01a0da',GradientType=0);
                background-color:#01a0da;

                display:inline-block;
                cursor:pointer;
                color:#ffffff;
                font-family:Arial;
                font-size:18px;
                font-weight:bold;
                padding-top: 5px;
                padding-bottom: 5px;

                text-decoration:none;
                text-shadow:0px -1px 0px #5b6178;
            }

            a:hover, a:visited, a:link, a:active
            {
                text-decoration: none;
            }

        </style>
    </head>
    <body>
        <script>
            $("body").ready(onBodyLoaded);
            $("body").ready(function () {
                $("#side-menu-button").click(function () {
                    // $("#side-menu").toggle();
                });
            });
        </script>
        <div data-role="page" id="entryPage" >
            <div data-role="header" id="mainHeader" >

                <img src="images/icon.png" class="ui-btn-left" />
                <a id="side-menu-button" data-icon="bars"  class="ui-btn-right" style="margin-top:0px;" href="#navpanel">Menu</a>
                <h3> Fish Cart</h3>
            </div>  
            <div data-role="content" >


                <a class="menu-button" onclick="setType('FISH');

                        loadProducts(productCache);" data-transition='flip' href="#productPage" data-role="button" data-inline="true" >
                    <img src="images/fish.png" class="ui-btn-bottom" />
                </a>

                <a class="menu-button" onclick="setType('MEAT');

                        loadProducts(productCache);" data-transition='flip'  href="#productPage" data-role="button" data-inline="true" >
                    <img src="images/meat.png" class="ui-btn-bottom" />
                </a>

                <a class="menu-button" onclick="setType('FOOD');

                        loadProducts(productCache);" data-transition='flip'  href="#productPage" data-role="button" data-inline="true" >
                    <img src="images/restaurant.png" class="ui-btn-bottom" />
                </a>           
                <a class="menu-button" onclick="setType('COOK');

                        loadProducts(productCache);" data-transition='flip'  href="#productPage" data-role="button" data-inline="true" >
                    <img src="images/cook.png" class="ui-btn-bottom" />
                </a>
                <a  onclick="setType('FISH');

                        loadProducts(productCache);" data-transition='flip' href="pricerise.html" data-role="button" data-inline="true" class="center-button ">
                    <img src="images/refer.png" class="ui-btn-bottom" />
                </a>
            </div>
            <div data-role="panel" id="navpanel" data-theme="b"
                 data-display="overlay" data-position="right">
                <div data-role="header" >
                    <div style="text-align: center;">Menu</div>
                </div>
                <div data-role="content" class="side-menu-item">Welcome,<span id="mUserName"> </span></div>
                <div data-role="header" >
                    <div style="text-align: center;">Orders</div>
                </div>
                <div data-role="content" id="orderSubmenu" class="side-menu-item" style="display: none">
                    <ul id="mOrderMenu"style="list-style-type:disc">

                    </ul>
                    <span >Grand total:</span><span id="mTotal"></span>
                </div>
                <div data-role="header" >
                    <div style="text-align: center;">Credit Balance</div>
                </div>
                <div data-role="content" class="side-menu-item">Rs.<span id="balance"> 0</span></div>
            </div>
            <div data-role="footer">
                <div style="font-size:xx-small">Supported by Addpix Solutions</div>
            </div>
        </div>



        <div data-role="page" id="popupInfo">
            <div data-role="header" >
                <a id="side-menu-button2" data-icon="carat-l"  class="ui-btn-left" style="margin-top:0px;" onclick="goBack();" href="">Back</a>
                <h3 style="margin-left:0px;margin-right:0px;" id="productName">Mathy sardine</h3> 
            </div>

            <div data-role="content">
                <img style="overflow:hidden;max-width:100%;" id="innerImage" src=""/>

                <div id='userinfo'>
                    <label for='phone'>Contact number:</label>
                    <input type='number' id='phone'/>
                </div>
                <div data-role="fieldcontain">
                    <label id="unitDescription" for="productPrice">Price per KG:</label>
                    <input type="text" id="productPrice" id="name" value="100" readonly="true" />
                </div> 



                <label for="quantity-step"> Select the quantity:</label>
                <input type="range" name="quantity" id="quantity-step" value="1" min=".5" max="5" step=".5"  data-highlight="true" />

                <div id="booking">
                    <fieldset data-role="controlgroup" id="timingControler" data-type="horizontal" data-mini="true">
                        <legend>Slot:</legend>

                 

                    </fieldset>
                    <div id="tip" style="display:none" class="alert-box notice"><span>Slot offer:</span>Get 5% discount if this slot is selected.</div>
                     <div id="warning" class="alert-box notice" ><span>Delivery Charge:</span>Delivery charge of Rs.50 will be applied. We guarantee delivery within 1 hour. If late, you don't need to pay for the product.</div>
                    <div id="dBox" style="display:none" class="alert-box discount"><span><b>You will have 5% discount .</b></span><input  id="dPrice" readonly="true" type="text"/></div>

                </div>
                <div data-role="fieldcontain">
                    <label  data-theme="d"  for="amountText"><b>Amount:</b></label>
                    <input data-theme="d"  type="text" name="clear" id="amountText" value="0" readonly="true">
                </div>

                <input id="orderButton" type="submit" value="PLACE ORDER" onclick="placeOrder()">
                <div id="response"></div>
            </div>
            <div data-role="popup" data-transition="flip" data-theme="d" id="successMessage" style="border-top: solid green 8px;background-color: white;width:260px;height:70px">
                Your order is placed successfully. Thank you for shopping with us.
                <a href="#" data-rel="back" data-role="button" data-theme="b" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>
            </div>
        </div>

        <div data-role="page" class="type-home" id="productPage">
            <div data-role="header" id="mainHeader" >


                <h3> Fish Cart</h3>
                <a id="side-menu-button2" data-icon="carat-l"  class="ui-btn-left" style="margin-top:0px;" onclick="goBack();" href="">Back</a>

                <a id="side-menu-button" data-icon="bars"  class="ui-btn-right" style="margin-top:0px;" href="#navpanelInner">Menu</a>

            </div>
            <div data-role="content" style="padding-top:0px">
                <fieldset id="filterPanel" data-role="controlgroup" data-type="horizontal" data-mini="true">


                    <input   type="radio" name="filter" id="all" value="on" checked="checked">
                    <label id="lNow" for="all">All</label>
                    <input  type="radio" name="filter" id="regular" value="off">
                    <label id="lLater"for="regular">Regular</label>
                    <input  type="radio" name="filter" id="premium" value="off">
                    <label id="lLater"for="premium">Premium</label>

                </fieldset>
                <ul  id="productList" class="BoxParent">
                </ul>
                <div data-role="footer" data-theme="c">
                    <ul>
                        <li>

                            For any queries please call 9605657736.
                        </li>
                        <li>
                            100% quality assurance. You can return the product if not happy with the quality.
                        </li>
                    </ul>

                </div>
            </div>
            <div data-role="panel" id="navpanelInner" data-theme="b"
                 data-display="overlay" data-position="right">
                <div data-role="header" >
                    Menu
                </div>
                <div data-role="content">Welcome,<span id="mUserName"></span></div>
                <div data-role="header" >
                    Orders
                </div>
                <div data-role="content" style="display:none;">
                    <ul id="mOrderMenu"style="list-style-type:disc">

                    </ul>
                    <span >Grand total:</span><span id="mTotal"></span>
                </div>
            </div>

        </div>
        <div>
            <li id="mProductName"><span id="mItem"></span><br/> <span id="mDetails" style=""></span></li> 
        </div>
    </div>
    <div data-role="page" class="type-home" id="rating">
        <div data-role="header">
            <h2>Rating</h2>
        </div>
        <div role="main" class="ui-content">
            <div >
                <fieldset id="qualityRating" data-role="none" class="rating" style="width:100%">
                    <legend data-role="none">Quality of the Product:</legend>                  
                    <input data-role="none" type="radio" id="star5" name="qRating" value="5" /><label for="star5" title="Rocks!">5 stars</label>
                    <input data-role="none" type="radio" id="star4" name="qRating" value="4" /><label for="star4" title="Pretty good">4 stars</label>
                    <input data-role="none" type="radio" id="star3" name="qRating" value="3" /><label for="star3" title="Meh">3 stars</label>
                    <input data-role="none" type="radio" id="star2" name="qRating" value="2" /><label for="star2" title="Kinda bad">2 stars</label>
                    <input data-role="none" type="radio" id="star1" name="qRating" value="1" /><label for="star1" title="Sucks big time">1 star</label>
                   
                </fieldset>
               
              <fieldset id="productRating" data-role="none" class="rating" style="width:100%">
                    <legend data-role="none">Delivery and Service:</legend>
                    <input data-role="none" type="radio" id="dstar5" name="dRating" value="5" /><label for="dstar5" title="Rocks!">5 stars</label>
                    <input data-role="none" type="radio" id="dstar4" name="dRating" value="4" /><label for="dstar4" title="Pretty good">4 stars</label>
                    <input data-role="none" type="radio" id="dstar3" name="dRating" value="3" /><label for="dstar3" title="Meh">3 stars</label>
                    <input data-role="none" type="radio" id="dstar2" name="dRating" value="2" /><label for="dstar2" title="Kinda bad">2 stars</label>
                    <input data-role="none" type="radio" id="dstar1" name="dRating" value="1" /><label for="dstar1" title="Sucks big time">1 star</label>
                </fieldset>
                
                
            </div>
            <div >
                <label for="feedbackMessage" style="position:float;left:0px">Feed back:</label>
                <textarea rows="10" name="feedbackMessage" id="feedbackMessage" ></textarea>
                <input id="feedbackButton" type="button" value="Submit" onclick="submitFeedback()">
            </div>
        </div>
    </div>

</body>
</html>