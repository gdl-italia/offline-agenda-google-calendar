/* === richiedo jquery, bootstrap === */
require(['jquery','calendar','bootstrap','domready!'], function($,Gcal){

	/* === inizializzo angularjs === */
	angular.bootstrap(document);

	/* === mostra box offline === */
	$('#offline').show();

});