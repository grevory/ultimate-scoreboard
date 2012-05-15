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
	this.Settings[key] = value;
	this.DisplayData(key);
};

ultimateScoreboard.NewGame = function() {

	//$('#new-game-modal').modal();

	console.log('this.Defaults',this.Defaults);
	this.Settings = jQuery.extend({}, this.Defaults);

	console.log('settings', this.Settings);

	for(var i in this.Settings)
	{
		this.DisplayData(i);
		//console.log('Adding local var '+i+' as '+this.Settings[i]);
		//this.Storage.Add("ultimateScoreboard."+i, this.Settings[i]);
	}

	//this.Set('them',this.Storage.Get('them'));
	//this.Set('us',this.Storage.Get('us'));

	//console.log(this.Get('us'));

	//this.Set('us','Mutiny');

	console.log(this.Get('us'));

};

ultimateScoreboard.IncrementScore = function (team) {

	// Needs to be us or them. Who could it be otherwise?
	if (team !== "us" && team !== "them")
		return false;

	var score = this.Get(team+'Score');
	var $this = this;

	$('.data-'+team+'Score').slideUp(function(){
		$this.Set(team+'Score',parseInt(score + 1));
		$('.data-'+team+'Score').slideDown();
	});


};

ultimateScoreboard.DecrementScore = function (team) {

	// Needs to be us or them. Who could it be otherwise?
	if (team !== "us" && team !== "them")
		return false;

	var score = this.Get(team+'Score');

	this.Set(team+'Score',parseInt(score - 1));

};

ultimateScoreboard.DisplayData = function (key) {
	var data = this.Get(key);
	console.log('Displaying text for '+key+' = '+data);
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
    	console.log('Adding '+ultimateScoreboard.Storage.prefix+key+' as '+value);

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

    	console.log('Getting value for '+ ultimateScoreboard.Storage.prefix+key);

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

    	var defaults = this.Defaults;

    	for (var i in defaults) {
			this.Storage.Remove(ultimateScoreboard.Storage.prefix+i);
		}
    },
};

ultimateScoreboard.Init = function() {

	//this.Storage.Add("Defaults.us","Get At Me Wolf");

	// Set the defaults if set by the user
	var defaults = this.Defaults;

	for (var i in defaults) {
		//defaults[i] = this.Storage.Get(i);
		if (this.Storage.Get("Defaults."+i)) {
			defaults[i] = this.Storage.Get("Defaults."+i);
			console.log('this.Defaults.'+i+' = '+defaults[i]);
		}
	}

	ultimateScoreboard.Bind();

	ultimateScoreboard.ScoreBoxSize = $('.displayed-score').width();

	this.NewGame();

};

ultimateScoreboard.DrawScoreboard = function() {
// console.log('Height: '+$(document).height());
// 	var scoreboardHeight = $(document).height() * 0.6;
// console.log('NewHeight: '+scoreboardHeight);
// 	$('.displayed-score').height(scoreboardHeight);

}

ultimateScoreboard.Bind = function() {
	// $(window).resize(function() {
	// 	ultimateScoreboard.DrawScoreboard();
	// });

	$this = this;

	$(".displayed-score").fitText(0.2);

	//console.log('Draw '+$(document).width());
	//ultimateScoreboard.DrawScoreboard();

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

			$('#game-settings-modal').modal('hide')

			return false;
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