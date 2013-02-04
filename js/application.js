/* == setup == */
require.config({
  paths:{
  	jquery: "vendor/jquery-1.8.3.min",
  	bootstrap: "vendor/bootstrap/js/bootstrap.min",
  	async: "vendor/requirejs-plugins-master/src/async",
    propertyParser: "vendor/requirejs-plugins-master/src/propertyParser",
    domready: "vendor/domReady",
    underscore: "vendor/underscore-min",
    angularjs: "vendor/angular.min",
    
    gapi: "js/gapi",
    gcal: "js/gcal",
    calendar: "js/calendar"
  },
  shim:{
  	"bootstrap": {
			deps: ["jquery"],
			exports: "$.fn.popover"
		}
  }
});

/* == config == */
config = {
	clientid: 	_your_client_id_,
	apikey: 	_your_api_key_,
	scope: 	"https://www.googleapis.com/auth/calendar",
	calendario: "calendario"	
}
