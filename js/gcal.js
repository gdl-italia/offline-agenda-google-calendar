/* === gestisce il recupero di informazioni da google calendar === */
define(['jquery','gapi','underscore'],function($,gapi){

	/* === imposto la chiave api nel costruttore === */
	var Gcal = function(config){
		this.clientid = config.clientid;
		this.scope = config.scope;
		this.immediate = true;
		gapi.client.setApiKey(config.apikey);
		_.bindAll(this);
		window.setTimeout(this.checkauth,1);

		// eventi
		$(window).on('ricarica:eventi', this.eventi);
		$(window).on('sincronizza:eventi', this.sincronizza);
	};

	/* === controllo che l'utente non sia gia autenticato === */
	Gcal.prototype.checkauth = function(immediate){
		gapi.auth.authorize({
				client_id: this.clientid, 
				scope: this.scope, 
				immediate: this.immediate
			}, 
			this.authresponse
		);
	};

	/* === faccio comparire il popup o recupero le attivita === */
	Gcal.prototype.authresponse = function(result){
		var self = this;
		if (result && !result.error) {
			$('#login').modal('hide');
			gapi.client.load('calendar','v3', function(){
				self.sincronizza();
				self.calendari();
			});
		}else{
			this.immediate = false;
			$('#login')
				.modal({ backdrop: false, keyboard: false })
				.one('click', this.checkauth);	
		}
	};

	/* === recupero l'elenco dei calendari === */
	Gcal.prototype.calendari = function(){
		var request = gapi.client.calendar.calendarList.list();
		$('#azione').text('aggiorno i calendari ...');
		request.execute(function(resp) {
			$('#azione').text('');
			localStorage.setItem(config.calendario,
				JSON.stringify(resp.items)
			);
			$(window).trigger('aggiorna:calendario');
		});
	};

	/* === recupero gli eventi dal calendario scelto === */
	Gcal.prototype.eventi = function(evt, calendarioid){
		var request = gapi.client.calendar.events.list({
			calendarId: calendarioid
		});
		$('#azione').text('aggiorno gli eventi ...');
		request.execute(function(resp){
			$('#azione').text('');
			localStorage.setItem('cal_' + calendarioid, JSON.stringify(resp.items));
			$(window).trigger('aggiorna:eventi');
		});
	}

	/* === sincronizzo i nuovi eventi su google calendar === */
	Gcal.prototype.sincronizza = function(){
		var eventi;
		this.eventidasinc = {};

		for(var x=0; x < localStorage.length; x++){
			var key = localStorage.key(x);
			if(key.substr(0,4) === 'cal_'){
				this.eventidasinc[key] = _.filter( 
					JSON.parse(localStorage.getItem(key)),
					function(item){ return item.nuovo; }
				);
				if(this.eventidasinc[key].length > 0){
					this.eventipush(key)
				}
			}
		}
	}

	/* === crea un nuovo evento e poi richiama se stesso === */
	Gcal.prototype.eventipush = function(key){
		$('#azione')
			.text('sincronizzo ' + key + ', rimanenti: ' + this.eventidasinc[key].length);
		
		var evento = this.eventidasinc[key].pop(), self = this;
		if(!evento){	
			$('#azione').text('');
			this.eventi(undefined, key.substr(4));
			return; 
		}

		var request = gapi.client.calendar.events.insert({
			calendarId: evento.calendarioid,
			resource:{
				end: evento.end,
				start: evento.start,
				summary: evento.summary,
				description: evento.description
			}
		});

		request.execute(function(resp){
			window.setTimeout(function(){ self.eventipush(key) },1);
		});
	} 

	return Gcal;
});