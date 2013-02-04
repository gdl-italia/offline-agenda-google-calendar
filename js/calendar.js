define(['jquery','underscore','angularjs'], function($){

	CalendarCtrl = function ($scope){

		// recupero i calendari dal localStorage
		$scope.aggiornacalendario = function(){
			$scope.calendari = localStorage.getItem(config.calendario) ? 
				JSON.parse(localStorage.getItem(config.calendario)) :
				[];
		}

		// ricarico gli eventi
		$scope.ricaricaeventi = function(){
			$scope.aggiornaeventi();
			$(window).trigger('ricarica:eventi',[$scope.calendario.id]);
		}

		// recupero gli eventi dal localStorage
		$scope.aggiornaeventi = function(){
			var eventi = localStorage.getItem('cal_' + $scope.calendario.id)
			$scope.eventi = eventi ? _.sortBy(JSON.parse(eventi), function(evento){
				return evento.start.dateTime ? evento.start.dateTime : evento.start.date
			}) : [];
		}

		// salvo un evento su localstorage 
		$scope.salvaevento = function(){
			var eventi = localStorage.getItem('cal_' + $scope.calendario.id),
					eventiobj = eventi ? JSON.parse(eventi) : [];
			eventiobj.push({
				calendarioid: $scope.calendario.id,
				summary: $scope.titoloevento,
				description: $scope.descrizioneevento,
				end:{ date: $scope.dataevento },
				start:{ date: $scope.dataevento },
				nuovo: true,
				classe: 'warning'
			});
			$scope.titoloevento = $scope.descrizioneevento = $scope.dataevento = "";
			localStorage.setItem('cal_' + $scope.calendario.id, JSON.stringify(eventiobj));			
			$scope.aggiornaeventi();
			$(window).trigger('sincronizza:eventi');			
		}

		$(window).on('aggiorna:eventi', function(){ $scope.$apply(function(){ $scope.aggiornaeventi(); }) });
		$(window).on('aggiorna:calendario', function(){ $scope.$apply(function(){ $scope.aggiornacalendario(); }) });
		$scope.aggiornacalendario();
	}

});