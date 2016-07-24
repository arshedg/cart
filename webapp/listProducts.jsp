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
                        $('#booking').show(true);
                        loadProducts(productCache);" data-transition='flip' href="#productPage" data-role="button" data-inline="true" >
                    <img src="images/fish.png" class="ui-btn-bottom" />
                </a>
                
                <a class="menu-button" onclick="setType('MEAT');
                        $('#booking').hide(true);
                        loadProducts(productCache);" data-transition='flip'  href="#productPage" data-role="button" data-inline="true" >
                    <img src="images/meat.png" class="ui-btn-bottom" />
                </a>
               
                <a class="menu-button" onclick="setType('FOOD');
                        $('#booking').hide(true);
                        loadProducts(productCache);" data-transition='flip'  href="#productPage" data-role="button" data-inline="true" >
                    <img src="images/restaurant.png" class="ui-btn-bottom" />
                </a>           
                <a class="menu-button" onclick="setType('COOK');
                   $('#booking').hide(true);
                   loadProducts(productCache);" data-transition='flip'  href="#productPage" data-role="button" data-inline="true" >
                    <img src="images/cook.png" class="ui-btn-bottom" />
                </a>
                <a  onclick="setType('FISH');
                        $('#booking').show(true);
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
                <h3 style="margin-left:0px;" id="productName">Mathy sardine</h3> 
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
                    <fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">
                        <legend>Delivery Time:</legend>

                        <input   type="radio" name="timing" id="now" value="on" checked="checked">
                        <label id="lNow" for="now">Right now</label>
                        <input  type="radio" name="timing" id="later" value="off">
                        <label id="lLater"for="later">Tomorrow morning</label>

                    </fieldset>
                    <div id="tip" class="alert-box notice"><span>Tip:</span>Book fish for tomorrow and get 5% discount.</div>

                    <div id="dBox" class="alert-box discount"><span><b>You will have 5% discount .</b></span><input  id="dPrice" readonly="true" type="text"/></div>

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

                <img src="images/icon.png" class="ui-btn-left" />
                <h3> Fish Cart</h3>
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
                <ul data-role="listview" id="productList" data-inset="true" data-theme="c" data-dividertheme="a">
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


</body>
</html>