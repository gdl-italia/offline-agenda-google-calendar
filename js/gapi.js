/* === trasformiamo il loader in AMD === */
define(['async!https://apis.google.com/js/client.js'], function(){
	return gapi;
});