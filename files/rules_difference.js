function roll(img_elt, file) {
  img_elt.src = file.src;
}

function is_shown(game_ids) {
  // given a set of game ids, check if any is shown. If so, return True.
  // If all are hidden, return False.
  for (var i = 0; i < game_ids.length; i++) {
    checkbox = document.getElementById(game_ids[i]);
    if (checkbox && checkbox.checked) {
      return true;
    }
  }
  return false;
}

function show_hide_games(game_ids, show_state) {
  // show or hide all classes with one of the game_ids.
  // game_ids is an array. If show_state is a boolean, that 
  // value is used. Otherwise, the is_shown(game_ids) function
  // if called for each element.
  if (typeof game_ids == 'string') {
    game_ids = [game_ids]
  }
  // console.log("show_hide_games", game_ids, show_state);
  // loop through all game_ids
  for (var i = 0; i < game_ids.length; i++) {
    // loop through all elements with gameid as class.
    var elts = document.getElementsByClassName(game_ids[i]);
    for (var j = 0; j < elts.length; j++) {
      elt = elts[j];
      if (typeof(show_state) == 'undefined') {
        var classes = elt.className.split(' ');
        show = is_shown(classes);
      } else {
        show = show_state;
      }
      if (show) {
        // elt.style.display = '';
        elt.classList.add("visible")
        elt.classList.remove("invisible")
      } else {
        // elt.style.display = 'none';
        elt.classList.add("invisible")
        elt.classList.remove("visible")
      }
    }
  }
}

function checkgame(checkbox_elt) {
  // handle a click on a checkbox to show or hide a game.
  // Assumes that the checkbox has already flipped state
  // (e.g. this should be called onclick, not onmouseup.)
  gameid = checkbox_elt.id;
  // console.log(gameid, checkbox_elt.checked);
  // loop through all elements with gameid as class.
  show_hide_games(gameid)
  checked_games = update_gamelist_all();
  save_checked_games(checked_games);
}

function check_all_games(all_checkbox) {
  // handle a click on the <all> checkbox.
  var show = all_checkbox.checked;
  var all_games = [];
  var checked_games = [];
  var gamelist = document.getElementById('gamelist');
  var checkboxes = gamelist.getElementsByTagName('input');
  for (var i = 0; i < checkboxes.length; i++) {
    checkbox = checkboxes[i];
    if (checkbox == all_checkbox) continue;
    gameid = checkbox.id;
    checkbox.checked = show;
    if (show) {
      checked_games.push(gameid)
    }
    all_games.push(gameid)
  }
  show_hide_games(all_games, show);
  save_checked_games(checked_games);
}

function update_gamelist_all() {
  // Update the state of the <all> checkbox, based on the other checkboxes.
  // returns a list of checked games
  has_checked = false
  has_unchecked = false
  var checked_games = [];
  var gamelist = document.getElementById('gamelist');
  // console.log(gamelist);
  var all_checkbox = document.getElementById('all');
  var checkboxes = gamelist.getElementsByTagName('input');
  for (var i = 0, l = checkboxes.length; i < l; i++) {
    checkbox = checkboxes[i];
    if (checkbox == all_checkbox) continue;
    if (checkbox.checked) {
      has_checked = true;
      checked_games.push(checkbox.id)
    } else {
      has_unchecked = true;
    }
  }
  // console.log(has_checked, has_unchecked);
  if (has_checked && has_unchecked) {
    all_checkbox.indeterminate = true;
    all_checkbox.checked = true;
  } else if(has_checked) {
    all_checkbox.indeterminate = false;
    all_checkbox.checked = true;
  } else {
    all_checkbox.indeterminate = false;
    all_checkbox.checked = false;
  }
  return checked_games;
}

function save_checked_games(checked_games) {
  // Store checked games in HTML5 local storage.
  try {
    localStorage.setItem("checked_games", checked_games.join(' '));
  } catch(ReferenceError) {
    // silenty ignore.
  }
}

function in_array(value, array) {
  // custom array.contains() method, since IE 8 does not support indexOf.
  for (i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
}

function restore_checked_games() {
  // Restore checked games from HTML5 local storage.
  try {
    checked_games = localStorage.getItem("checked_games").split(' ');
  } catch(ReferenceError) {
    // abort; HTML5 localStorage is not supported.
    return
  }
  // console.log(checked_games);
  var all_games = []
  var gamelist = document.getElementById('gamelist');
  var checkboxes = gamelist.getElementsByTagName('input');
  for (var i = 0; i < checkboxes.length; i++) {
    checkbox = checkboxes[i];
    gameid = checkbox.id;
    if (gameid == 'all') continue;
    checkbox.checked = in_array(gameid, checked_games);
    all_games.push(gameid);
  }
  // console.log(all_games);
  show_hide_games(all_games);
  update_gamelist_all();
}


// Run the following as soon as the page has loaded
window.onload = function() {
  // preload images
  if (document.images) {
    img1 = new Image;
    img2 = new Image;
    img1.src = "./files/18xx_x.gif";
    img2.src = "./files/18xx.gif";
  }
  
  restore_checked_games();
};
