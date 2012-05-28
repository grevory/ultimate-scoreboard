var ultimateScoreboard = {};

// Default settings
ultimateScoreboard.Defaults = {
	us: "Us", // STRING
	them: "Them", // STRING
	usScore: 0, // INT
	themScore: 0, // INT
	timeCap: "" // STRING
};

ultimateScoreboard.Settings = {};

ultimateScoreboard.ScoreBoxSize = 0;

ultimateScoreboard.Get = function (key) {
	return this.Settings[key];
};

ultimateScoreboard.Set = function (key, value) {
	// Update the script variable with the new value
	this.Settings[key] = value;
	// Store the new value in Local Storage
	this.Storage.Add(key,value);
	// Update the data in the view
	this.DisplayData(key);
};

ultimateScoreboard.NewGame = function() {

	this.Settings = jQuery.extend({}, this.Defaults);

	this.Storage.Empty();

	this.LoadGame();

};

ultimateScoreboard.LoadGame = function() {

	for(var i in this.Settings)
	{
		this.DisplayData(i);
	}

};

ultimateScoreboard.IncrementScore = function (team) {

	// Needs to be us or them. Who could it be otherwise?
	if (team !== "us" && team !== "them")
		return false;

	var score = this.Get(team+'Score');
	var $this = this;

	$this.Set(team+'Score',parseInt(score + 1));
};

ultimateScoreboard.DecrementScore = function (team) {

	// Needs to be us or them. Who could it be otherwise?
	if (team !== "us" && team !== "them")
		return false;

	var score = this.Get(team+'Score');

	// Only decrement the score if it is positive
	if (score > 0)
		this.Set(team+'Score',parseInt(score - 1));

};

ultimateScoreboard.DisplayData = function (key,data) {
	
	if (!data)
		data = this.Get(key);

	$('.data-'+key).text(data);
};

ultimateScoreboard.Storage = {
	prefix: 'ultimateScoreboard.',
    isSupported: function () {
        try {
            return ('localStorage' in window && window['localStorage'] !== null);           
        } catch (e) {
            return false;
        }
    },
    Add: function (key, value) {
    	if (!ultimateScoreboard.Storage.isSupported()) {
    		return false;
    	}

        try {
                localStorage.setItem(ultimateScoreboard.Storage.prefix+key, value);
                //or localStorage[key] = value; //like associative arrays
            } catch (e) {
                console.error(e.Description);
                return -1;
            }
    },
    Get: function (key) {
    	if (!ultimateScoreboard.Storage.isSupported()) {
    		return false;
    	}

        return localStorage.getItem(ultimateScoreboard.Storage.prefix+key);
        //or localStorage[key];
    },
    Remove: function (key) {
    	if (!ultimateScoreboard.Storage.isSupported()) {
    		return false;
    	}
    	return localStorage.removeItem(key);
    },
    // Remove all data
    Empty: function () {
    	if (!ultimateScoreboard.Storage.isSupported()) {
    		return false;
    	}

    	var defaults = ultimateScoreboard.Defaults;

    	for (var i in defaults) {
			ultimateScoreboard.Storage.Remove(ultimateScoreboard.Storage.prefix+i);
		}
    },
};

ultimateScoreboard.Init = function() {

	// Set the defaults if set by the user
	var defaults = this.Defaults;
	var settings = this.Settings;

	for (var i in defaults) {
		//defaults[i] = this.Storage.Get(i);
		if (this.Storage.Get("Defaults."+i)) {
			defaults[i] = this.Storage.Get("Defaults."+i);
		}

		if (this.Storage.Get(i)) {
			settings[i] = this.Storage.Get(i);
		}
	}

	ultimateScoreboard.Bind();

	ultimateScoreboard.ScoreBoxSize = $('.displayed-score').width();

	this.Settings = jQuery.extend({}, this.Defaults, this.Settings);

	this.LoadGame();

};

ultimateScoreboard.Bind = function() {

	$this = this;

	$('.displayed-score').fitText(0.2);

	$('a[href=#new-game]').click(function(){
		$this.NewGame();
		return false;
	});

	$('a[href=#game-settings]').click(function(){

		for (var i in $this.Settings) {
			$('#game-settings-modal .settings-'+i).val($this.Settings[i]);
		}

		$('#game-settings-modal').modal();

		$('#game-settings-modal a[href=#continue]').click(function(){

			for (var i in $this.Settings) {
				$this.Set(i,$('#game-settings-modal .settings-'+i).val());
			}

			$('#game-settings-modal').modal('hide');

			return false;
		});

		return false;
	});

	$('.action-increment-score').click(function(){
		
		var team = $(this).parents('.team-score').attr('data-team');
		if (!team)
			return false;
		
		$this.IncrementScore(team);
		return false;
	});

	$('.action-decrement-score').click(function(){
		
		var team = $(this).parents('.team-score').attr('data-team');
		if (!team)
			return false;
		
		$this.DecrementScore(team);
		return false;
	});

	$('.our-name, .their-name').unbind('click').bind('click',function(){
		
		$('#team-name-modal a[href=#update]:visible').hide();

		var clicked_team = 'us';
		if ($(this).hasClass('their-name'))
			clicked_team = 'them';

		if (clicked_team == 'us')
		{
			$('#team-name-modal label').text('Our team name');
			$('#team-name-modal .add-on i').removeClass('icon-plane').addClass('icon-home');
		}

		if (clicked_team == 'them')
		{
			$('#team-name-modal label').text('Their team name');
			$('#team-name-modal .add-on i').removeClass('icon-home').addClass('icon-plane');
		}

		$('#team-name-modal .update-team').val('').focus();

		$('#team-name-modal').modal().css(
			{
				'margin-top': function () {
				return -($(this).height() / 2);
			}
		});

		var _update_name = function() {
			
			var new_name = $('#team-name-modal .update-team').val();
			
			if (!new_name)
				return false;

			$this.Set(clicked_team,new_name);

			$('#team-name-modal').modal('hide');
			//$('#team-name-modal .update-team').val('');
			return false;
		};

		$('#team-name-modal a[href=#update]').unbind('click').bind('click',function(){
			return _update_name();
		});

		$('#team-name-modal .update-team').unbind('keyup.updateteam').bind('keyup.updateteam',function(e){

			if ($(this).val() != '')
				$('#team-name-modal a[href=#update]:hidden').fadeIn('slow');

			if ($(this).val() == '')
				$('#team-name-modal a[href=#update]:visible').fadeOut('fast');

			var code = (e.keyCode ? e.keyCode : e.which);
			// Check to see if the user hits ENTER
			if (code == 13)
				_update_name();
		});

		return false;
	});
}

// ultimateScoreboard.CalculateResizeFactor = function() {

// 	var ScoreBoxSize = this.ScoreBoxSize;
// 	var newBoxSize = $('.displayed-score').width();

// 	return parseFloat(ScoreBoxSize / newBoxSize);
// }

// Initialize the scoreboard
ultimateScoreboard.Init();