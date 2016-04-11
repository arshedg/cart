function registerUser() {
    var user = document.getElementById("user").value;
    var number = document.getElementById("number").value;
    var referred = document.getElementById("referrer").value;
    if(referred!=""&&(referred.trim().length!=10)){
        alert("Referred mobile number should be 10 digits");
        return;
    }
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            registerResponse(xhttp);
        }
    };
    var appender = new Date().getTime();
    //Being extra safe in over-riding caching
    var url="api/register?name="+user+"&no="+number+"&referred="+referred+"&appender="+appender;
    document.getElementById("register").value="PLEASE WAIT";
     document.getElementById("register").disabled=true;
    xhttp.open("GET", url, true);
    xhttp.send();
}
function toggle(e){
  if(e.srcElement.value=="nobody"){
    document.getElementById("referrer").style.display="none";
  }else{
     document.getElementById("referrer").style.display="";
  }
   
}
function registerResponse(response){
    var responseText = response.responseText;
    var status = responseText.split(":")[0];
    if(status=="SUCCESS"){  
        showMessage(status);
        var identity = responseText.split(":")[1];
        showMessage("identity from server:"+identity);
        saveIdentity(identity);
        saveNumber();
        redirect('listProducts.jsp');;
    }else
    {
        document.getElementById("register").value="REGISTER";
        document.getElementById("register").disabled=false;
        showMessage(response.responseText);
    }
}
function redirect(uri) {
  if(navigator.userAgent.match(/Android/i)) 
    document.location=uri;      
  else
    window.location.replace(uri);
}
function saveNumber(){
    try{
        Android.saveNumber(document.getElementById("number").value);
    }catch(error){
        NUMBER = document.getElementById("number").value;
        //may be not an android device
    }
}

function showMessage(toast) {
    try{
        Android.showToast(toast);
    }catch(error){
        alert(toast)
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
function getNumberFromBrowser() {
    if (typeof (Storage) !== "undefined") {
        return localStorage.getItem("number");
    } else {
        return "";
    }
}
function saveIdentity(identity){
    if(isAndroid()){
        Android.saveKeyValue("identity",identity);
    }
}
function getIdentity(){
    if(isAndroid()){
        return Android.readValue("identity");
    }
}

function isAndroid() {
    try {
        Android;
        return true;
    } catch (e) {
        return false;
    }
}