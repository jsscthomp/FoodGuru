$(document).ready(function() {
 +  //initializing firebase
 +  var config = {
 +        apiKey: "AIzaSyAIezGr773BQU-TDtuupeccp2gL_OFkuZ4",
 +        authDomain: "food-guru-33241.firebaseapp.com",
 +        databaseURL: "https://food-guru-33241.firebaseio.com",
 +        projectId: "food-guru-33241",
 +        storageBucket: "food-guru-33241.appspot.com",
 +        messagingSenderId: "810775232856"
 +    };
  
 +    firebase.initializeApp(config);
 +    //universal variables
 +    var database = firebase.database();
 +    var ingredientName = "";
 +  
 +  var eatMe;
  
 -  var queryURL = "https:www.googleapis.com/youtube/v3/search?&part=snippet&q=quinoa&key=AIzaSyCqtkizKR5dTv4AP90rXLCGNG9-LLIrG_Y";
 +  //on-click function that calls EVERYTHING
 +  $("#add-ingredient-btn").on("click", function(){
 +    event.preventDefault();
 +    eatMe = $("#ingredient-name-input").val().trim();
 +    youTubeCall();
 +    wikiCall();
 +    firebaseData();
 +    $("#ingredient-name-input").val("");
 +  });
  
 -  $.ajax ({
 -    url: queryURL,
 -    method: "GET"
 -  }).done(function(response){
 +  //YouTube API Call & iFrame creation
 +    function youTubeCall() {
 +      
 +      $(".videoResults").empty();
 +    var queryURL = "https:www.googleapis.com/youtube/v3/search?&part=snippet&q=" + eatMe + "+recipe&key=AIzaSyCqtkizKR5dTv4AP90rXLCGNG9-LLIrG_Y";
 +   
 +    $.ajax ({
 +      url: queryURL,
 +      method: "GET"
 +    }).done(function(response){
 +      for (var i = 0; i < response.items.length; i++) {
 +      
 +        var item = response.items[i];
 +        var videoId = item.id.videoId;
  
 -    for (var i = 0; i < response.items.length; i++) {
 -      var item = response.items[i];
 -      var videoTitle = item.snippet.title;
 -      var videoId = item.id.videoId;
 -      var imageURL = item.snippet.thumbnails.default.url;
 -      var videoThumb = '<pre><img id="thumb" src=" '+imageURL+' " alt="No Image Available." style="width:204px;height:128px"></pre>';
 +        console.log(item.snippet.title + " " + item.id.videoId);
 +        var videoUrl = "https://www.youtube.com/embed/" + videoId;
 +        var videoNum = "video" + i;
 +        $("#video" + i).attr("src", videoUrl);
  
 -      console.log(item.snippet.title + " " + item.id.videoId);
 +        //iFrame creation and apprending to results div 
 +        var videoPlayer = $("<iframe class='video w100' width='640' height='360' src='#' frameborder='0' allowfullscreen style='margin:20px'>");
 +        
 +        videoPlayer.attr("id", videoNum);
  
 -      var videoUrl = "https://www.youtube.com/embed/" + videoId;
 +        videoPlayer.attr("src", videoUrl);
  
 -      $("#video" + i).attr("src", videoUrl);
 +        $(".videoResults").append(videoPlayer);
  
 -    };
 +
 +      };
 +    
 +    });  
 +  }; 
 +
 +  //mediaWiki call & results display
 +  function wikiCall() {
 +      var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=500&titles=" + eatMe + "&format=json";
 +      function wikiWiki() {
 +          wikiURL += '?' + $.param({
 +             'action' : 'query',
 +             'search' : $("#ingredient-name-input"),
 +             'prop'  : 'info',
 +             'format' : 'json',
 +             'limit' : 10
 +          });
 +      };
 +      
 +      $.ajax( {
 +          url: wikiURL,
 +          dataType: 'jsonp',
 +          success: function(response) {
 +             console.log(response);
 +              for (var prop in response.query.pages) {
 +                  console.log(prop);
 +                  var result = response.query.pages[prop];
 +                  console.log(result);
 +                  $("#searchResults").html(result.extract);
 +              };
 +          }
 +      });
 +  }
    
 -  })  
  
 -}) 
 +  //logging search term into Firebase
 +    function firebaseData() {
 +        ingredientName = $("#ingredient-name-input").val().trim();
 +        database.ref().push({
 +            name: ingredientName,
 +        });
 +        database.ref().on("child_added", function(childSnapshot, prevChildKey) {
 +            //console.log(childSnapshot.val());
 +            var ingredientName = childSnapshot.val().name;
 +            console.log(ingredientName);
 +        
 +            $("#ingredient-name-input").html(childSnapshot.val().ingredientName);
 +        });
 +    };
 +}); 