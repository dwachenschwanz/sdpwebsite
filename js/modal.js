/* ==========================================================================
   Captavi Modal Window JS
   Captavi copyright 2015
   ========================================================================== */
function CaptaviModal(title, body, overlayClose, ajax, ajaxContainerId, delayOpen) {
	//// Dynamic Vars ////
	var title = title || '';
	var body = body || '<div id="CaptaviModalLoading">...Loading...</div>';
	var overlayClose = overlayClose || false;
	var ajax = ajax || false;
	var ajaxContainerId = ajaxContainerId || false;
	var delayOpen = delayOpen || 0;
	//////////////////////
    var height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)+"px";
	if(ajax !== false){
		if (ajax === true) {
			console.log("Ajax set to true. Instead please provide url.")
		};
		var ajaxPage;
		ajaxPage = new XMLHttpRequest();
			ajaxPage.onreadystatechange = function(){
				if (ajaxPage.readyState!==4) {
					if (!document.getElementById("CaptaviModalOverlay")) {

					} else {
						document.getElementById("CaptaviModalTitle").innerHTML = title+'<a class="CaptaviModalClose" onclick="CaptaviModal(); return false;" href="#_"><strong>X</strong></a>';	
						document.getElementById("CaptaviModalBody").innerHTML = '<div id="CaptaviModalLoading">...Loading...</div>';  						
					}
				};
	  		if (ajaxPage.readyState==4 && ajaxPage.status==200){
	  			if (ajaxContainerId !== false) {
	  				var el =  document.getElementById("CaptaviModalBody");
					el.innerHTML = ajaxPage.responseText;
					var ajaxContainer = document.getElementById(ajaxContainerId);
					el.innerHTML = ajaxContainer.innerHTML;
   					document.getElementById("CaptaviModalTitle").innerHTML = title+'<a class="CaptaviModalClose" onclick="CaptaviModal(); return false;" href="#_"><strong>X</strong></a>';	
	  			} else {
					var response = this.getResponseHeader('content-type').split("/");
					if (response[0] === "image") {
						document.getElementById("CaptaviModalTitle").innerHTML = title+'<a class="CaptaviModalClose" onclick="CaptaviModal(); return false;" href="#_"><strong>X</strong></a>';
						document.getElementById("CaptaviModalBody").innerHTML = "<img src='"+ajax+"' alt='Modal Image'/>";
					} else {
    					document.getElementById("CaptaviModalTitle").innerHTML = title+'<a class="CaptaviModalClose" onclick="CaptaviModal(); return false;" href="#_"><strong>X</strong></a>';	
    					document.getElementById("CaptaviModalBody").innerHTML = ajaxPage.responseText;	
					};
	  			};
			};
		};
		ajaxPage.open("GET", ajax, true);
		ajaxPage.send();
	};
	if (!document.getElementById("CaptaviModalOverlay")) {
		setTimeout(function(){
			var string = '<div id="CaptaviModalWindow"><div id="CaptaviModalTitle">'+title+'<a class="CaptaviModalClose" onclick="CaptaviModal(); return false;" href="#_"><strong>X</strong></a></div><div id="CaptaviModalBody">'+body+'</div></div>';
			var el =  document.createElement("div")
			el.id="CaptaviModalOverlay";
			el.style.visibility="visible";
			el.style.height=height;
			el.innerHTML = string;
			document.body.appendChild(el);
			if (overlayClose == true) {
				document.getElementById("CaptaviModalOverlay").onclick = function(){CaptaviModal();return false};
				document.getElementById("CaptaviModalWindow").onclick = function(event){event.stopPropagation();};
			};
		}, delayOpen);
	} else {
		var el = document.getElementById("CaptaviModalOverlay")
		el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
		if (overlayClose == true) {
			document.getElementById("CaptaviModalOverlay").onclick = function(){CaptaviModal();return false};
			document.getElementById("CaptaviModalWindow").onclick = function(event){event.stopPropagation();};
		};
	};
};
function bindModal(i){
	var link = modalElements[i].href;
	var name = modalElements[i].name;
	var title = modalElements[i].title;
	modalElements[i].id= "CaptaviModal"+i;
    document.getElementById("CaptaviModal"+i).onclick = function(){CaptaviModal(title,'<div id="CaptaviModalLoading">...Loading...</div>', true, link, name, 0); return false; }
}
var modalElements = document.getElementsByTagName("a");
for (i = 0; i < modalElements.length; i++) {
    if (modalElements[i].hasAttribute("rel") && modalElements[i].rel == "modal") {
    	bindModal(i);
    }
}