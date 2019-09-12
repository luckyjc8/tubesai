var module_updater = {
  _modules: {
    started_games: {
      refresh_interval_seconds: 60
    },
    games_between: {
      refresh_interval_seconds: 600
    },
    tournament_games: {
      refresh_interval_seconds: 60
    },
    player_current_games: {
      refresh_interval_seconds: 60
    },
    online_players: {
      refresh_interval_seconds: 60
    },
    challenges_badge: {
      refresh_interval_seconds: 60
    },
    global_badge: {
      refresh_interval_seconds: 60
    },
    translations_badge: {
      tag_ids: ['translations_badge_1', 'translations_badge_2'],
      refresh_interval_seconds: 600
    },
    player_finished_games: {
      refresh_interval_seconds: 60
    },
    player_suggested_challenges: {
      refresh_interval_seconds: 600
    }
  },

  _timers: {},

  start: function(module, url) {
    if (this._timers[module] !== undefined) {
      clearInterval(this._timers[module]);
    }

    this._updateModuleWithRequestResult(module, url);

    var timer = setInterval(
      (function() {
        this._updateModuleWithRequestResult(module, url);
      }).bind(this),
      this._modules[module].refresh_interval_seconds * 1000
    );

    this._timers[module] = timer;
  },

  _updateModuleWithRequestResult: function(module, url) {
    $.ajax({
      url: url,
      success: function(result) {
        result = eval("(" + result + ')');

        if (!$('#' + module + 'PerformanceDiv').length) {
          var tabLi = '<li role="presentation">' +
            '<a href="#' + module + 'PerformanceDiv" aria-controls="' + module +
            'PerformanceDiv" role="tab" data-toggle="tab">' + module + '</a></li>';
          $(tabLi).appendTo("#performanceTabList");
          var tabPanel = '<div role="tabpanel" class="tab-pane" id="' +
            module + 'PerformanceDiv">' + result.performance_info + '</div>';
          $(tabPanel).appendTo("#performanceTabContent");
        }

        var tag_ids = this._modules[module].tag_ids;
        if (tag_ids) {
          var i;
          for (i = 0; i < tag_ids.length; i++) {
            $("#" + tag_ids[i]).html(result.content);
          }
        } else {
          $("#" + module).html(result.content);
        }
      }.bind(this)
    });
  }
};