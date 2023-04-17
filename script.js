const form = document.getElementById("search-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchInput = document.getElementById("search-input").value;

  window.location.href = `https://www.youtube.com/results?search_query=${searchInput}`;
});

$(function () {
  // Define a function to fetch suggested search queries from YouTube API
  function fetchSearchSuggestions(query, callback) {
    // Make an AJAX call to YouTube API to fetch suggested search queries
    // Use query as the search term
    // Pass the list of suggested search queries to the callback function
  }

  // Define options for autocomplete
  var options = {
    // Specify the source function to fetch search suggestions
    source: function (request, response) {
      fetchSearchSuggestions(request.term, function (suggestions) {
        response(suggestions);
      });
    },
    // Specify the minimum length of the search query before autocomplete kicks in
    minLength: 3,
    // Specify what to do when a suggestion is selected
    select: function (event, ui) {
      // Set the value of the search bar to the selected suggestion
      $("#search-form").val(ui.item.value);
      // Redirect the user to the corresponding YouTube search results page
      window.location.href =
        "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(ui.item.value);
      // Prevent the form from submitting
      return false;
    },
  };

  // Enable autocomplete on the search bar
  $("#search-form").autocomplete(options);

  // Add event listener to update the search suggestions dropdown when the user types in the search bar
  $("#search-form").on("input", function () {
    // Fetch suggested search queries from YouTube API
    var query = $(this).val();
    fetchSearchSuggestions(query, function (suggestions) {
      // Create a list of search suggestion items
      var suggestionItems = suggestions.map(function (suggestion) {
        return "<li>" + suggestion + "</li>";
      });
      // Set the HTML content of the search suggestions dropdown to the list of suggestion items
      $("#search-suggestions").html(
        "<ul>" + suggestionItems.join("") + "</ul>"
      );
    });
  });

  // Add event listener to handle keyboard navigation and selection in the search suggestions dropdown
  $("#search-suggestions").on("keydown", function (event) {
    var suggestionItems = $(this).find("li");
    var selectedItem = $(this).find(".selected");
    if (event.keyCode == 38) {
      // Up arrow key
      if (selectedItem.length) {
        var prevItem = selectedItem.prev();
        if (prevItem.length) {
          selectedItem.removeClass("selected");
          prevItem.addClass("selected");
        }
      } else {
        suggestionItems.last().addClass("selected");
      }
      return false;
    } else if (event.keyCode == 40) {
      // Down arrow key
      if (selectedItem.length) {
        var nextItem = selectedItem.next();
        if (nextItem.length) {
          selectedItem.removeClass("selected");
          nextItem.addClass("selected");
        }
      } else {
        suggestionItems.first().addClass("selected");
      }
      return false;
    } else if (event.keyCode == 13) {
      // Enter key
      if (selectedItem.length) {
        // Set the value of the search bar to the selected suggestion
        $("#search-form").val(selectedItem.text());
        // Redirect the user to the corresponding YouTube search results page
        window.location.href =
          "https://www.youtube.com/results?search_query=" +
          encodeURIComponent(selectedItem.text());
        // Prevent the form from submitting
        return false;
      }
    }
  });

  // Add event listener to hide the search suggestions dropdown when the user clicks outside of it
  $(document).on("click", function (event) {
    if (!$(event.target).closest("#search-suggestions").length) {
      $("#search-suggestions").hide();
    }
  });
});

// Replace YOUR_YOUTUBE_API_KEY with your actual API key
var apiKey = "AIzaSyAQsSfNBGY1PQIesRtY3CpzkqD0V961AB4";

// Define the URL to fetch the search suggestions
var suggestURL = "https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=";

// Bind the autocomplete widget to the search input
$("#search-input").autocomplete({
  source: function(request, response) {
    // Fetch the search suggestions from the YouTube API
    $.ajax({
      url: suggestURL + request.term,
      dataType: "jsonp",
      data: {
        key: apiKey
      },
      success: function(data) {
        // Extract the search suggestions from the response
        var suggestions = data[1];
        // Pass the suggestions to the autocomplete widget
        response(suggestions);
      }
    });
  }
});
