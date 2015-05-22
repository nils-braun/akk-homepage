"use strict";

function transformSongIntoDiv(song) {
	var html = "<div class='ui-result_row'>";
	html += "<div>" + song.title + "</div>";
	html += "<div>" + song.artist_name + "</div>";
	html += "<div>" + song.dance_name + "</div>";
	html += "</div>";
	var newElement = $(html);

    newElement.click(function() {
        $("#edit_window").editWindow("show", song_id);
    });

	return newElement;
}

function transformDivIDIntoColumnName(element) {
	var id = $(element).parent().attr("class");
	if (id == "title_search") {
		return "songs";
	} else if (id == "artist_search") {
		return "artists";
	} else if (id == "dance_search") {
		return "dances";
	} else {
        return "search";
    }
}

function showResults(event, data) {
	$("#searchboxes").find("input").val("");
	$("#results_table").html("");

	var column = transformDivIDIntoColumnName(data.element);
	
	$.getJSON("../php/main.php", {action: "search", type: column, term: data.value}, function(data) {
		$("#results_table").html("");
		data.forEach(function(song) {
			$("#results_table").append(transformSongIntoDiv(song));
		});
	});
}

$(document).ready(function() {
	$("#searchboxes").find(".search").completion({
		result : showResults
	});
	
	$("#clear_button").click(function() {
		$("#searchboxes").find("input").val("");
		$("#results_table").html("");
	});

	var edit_window = $("#edit_window").editWindow({
	    updateSong: function(event, data) {
	        data.action = "update";
	        $.get("../php/main.php", data);
	        console.log(data);
	    },
	    createNewSong: function(event, data) {
	        data.action = "add";
	        $.get("../php/main.php", data);
	        console.log(data);
	    },
	    deleteSong: function(event, data) {
	        data.action = "delete";
	        $.get("../php/main.php", data);
	    }
	});

    $("#add_item").click(function() {
        $("#edit_window").editWindow("show");
    });
});