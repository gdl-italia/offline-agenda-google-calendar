/* === richiedo jquery, bootstrap e googlejsapi === */
require(['jquery','gcal','calendar','bootstrap','domready!'], function($,Gcal){

	/* === inizializzo angularjs === */
	angular.bootstrap(document);

	/* === nuovo oggetto gcal inizializzato al load === */
	var gcal = new Gcal(config);

	/* === mostra box online === */
	$('#online').show();

});