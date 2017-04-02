


$(document).ready(function(){

$('#savelistdiv').click(function() {

  $('#savelistdiv').addClass("savedList");
  $('#savelistdiv').html("Saved");

  console.log(list[0].title);
  $.ajax({
      url: "/api/users/createlist",
      type: "POST",
      data: saveListId,
      success: (id) => {
        window.location.href="/api/users/"+ id + "/addpoints";
      }
    });
});

  // make a .hover event
    $('#marker_info').hover(
      // mouse in
      function () {
        // first we need to know which <div class="marker"></div> we hovered
        var index = $('.listlabel').index(this);
        markers[index].setIcon(highlightedIcon());
      },
      // mouse out
      function () {
        // first we need to know which <div class="marker"></div> we hovered
        var index = $('.listlabel').index(this);
        markers[index].setIcon(normalIcon());
      }

    );

      function normalIcon() {
      return {
        url: 'http://1.bp.blogspot.com/_GZzKwf6g1o8/S6xwK6CSghI/AAAAAAAAA98/_iA3r4Ehclk/s1600/marker-green.png'
      };
    }
    function highlightedIcon() {
      return {
        url: 'http://steeplemedia.com/images/markers/markerGreen.png'
      };
    }
     $("#createListButton").click(function(event){
    event.preventDefault();
    let listDetails={
      title: $("#listTitle").val(),
      desc: $("#listDesc").val(),
      privacy: $("input[name='visibility']:checked").val(),
      date_created: new Date().toUTCString()
    }
    $.ajax({
      url: "/api/users/createlist",
      type: "POST",
      data: listDetails,
      success: (id) => {
        window.location.href="/api/users/"+ id + "/addpoints";
      }
      // error: (err) => {
      //   alert("Couldn't create list. \n Error: ",err);
      // }
    });
  });

});

function deletePoint(elem,event){
  $.ajax({
    url:"/api/users/deletepoint",
    type:"POST",
    data: {id:$(elem).closest("tr").attr("id")},
    success: () => {
      $("#rightpane").find("table").find("#"+$(elem).closest("tr").attr("id")).remove();
    }
  })
}

function displayPoint(point){
  $tr = $("<tr>").addClass("listrow").attr("id",point.id);
  $td = $("<td>").addClass("listrow");

  $font= $("<font>").addClass("namefont").text(point.name);
  $font.append("<i class=\"fa fa-minus-circle delete-point\" aria-hidden=\"true\" style=\"color:red;float:right\" onclick= \"deletePoint(this,event)\"></i>");
  $td.append($font.append("<br>"));

  $font= $("<font>").addClass("descfont").text(point.description);
  $td.append($font.append("<br>"));

  $font= $("<font>").addClass("addressfont").text(point.address);
  $td.append($font.append("<br>"));

  $tr.append($td);
  $("#rightpane").find("table").append($tr);
}


function editList(list_id){
  window.location.href="/api/users/"+ list_id + "/editList";
}


let infowindow = null;
let messagewindow = null;
let formattedAddress = null;

//initMap() initializes the map, search box in the create new list page and on clicking the marker, gets the input from user
//and saves the data point in the database.
function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.6446249, lng: -79.39519729},  //LHL
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);





  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
      //  icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      for (marker of markers){
        google.maps.event.addListener(marker, 'click', function(event) {
          //console.log(marker.getPosition().;
            if(infowindow==null)
              getLocationDetails(map, marker);
            else
              infowindow.open(map,marker);
        });
      }

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);

  });

  function getLocationDetails(map, marker){

    let $pt_name = $("<input>").attr({type:"text", id:"pt-name"});
    $tr1 = $("<tr>");
    $tr1.append($("<td>").text("Title: "));
    $tr1.append($("<td>").append($pt_name));

    $table = $("<table>");
    $table.append($tr1);

    let $pt_add = $("<input>").attr({type:"text", id:"pt-address"});
    $tr2 = $("<tr>");
    $tr2.append($("<td>").text("Address: "));
    $tr2.append($("<td>").append($pt_add));

    $table.append($tr2);

    let $pt_desc = $("<input>").attr({type:"text", id:"pt-description"});
    $tr3 = $("<tr>");
    $tr3.append($("<td>").text("Description: "));
    $tr3.append($("<td>").append($pt_desc));

    $table.append($tr3);

    let $save_button = $("<input>").attr({type:"button", id:"save-loc", value:"Save"});
    $tr4 = $("<tr>");
    $td4 = $("<td>").attr("colspan","2");
    $td4.css("text-align","center");
    $td4.append($save_button);
    $tr4.append($td4);

    $table.append($tr4);

    $div = $("<div>").attr("id","form").css("display","none");
    $div.append($table);

    $("#leftpane").append($div);

    let geocoder = new google.maps.Geocoder;
    let latlng = {lat:marker.getPosition().lat() , lng:marker.getPosition().lng()};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        //console.log(results[0].formatted_address);
        formattedAddress = results[0].formatted_address;
        $('#pt-address').val(formattedAddress);
      }
    });
    //debugger;
    infowindow = new google.maps.InfoWindow({
      content: document.getElementById("form")
    });

    $('#form').css("display","block");
    infowindow.open(map, marker);

    $("#save-loc").click(() => {

      let ptDetails={
        x: marker.getPosition().lat(),
        y: marker.getPosition().lng(),
        name: $("#pt-name").val(),
        desc: $("#pt-description").val(),
        address: $("#pt-address").val(),
        added_date: new Date().toUTCString(),
        updated_date: new Date().toUTCString(),
        listid: $('#rightpane').data('list-id')
      }
      //console.log(ptDetails);

      $.ajax({
        url: "/api/users/addpoints",
        type: "POST",
        data: ptDetails,
        success:(res) => {
          displayPoint(res[0]);
          // $tr = $("<tr>").addClass("listrow").attr("id",res[0].id);
          // $td = $("<td>").addClass("listrow");

          // $font= $("<font>").addClass("namefont").text(res[0].name);
          // $font.append("<i class=\"fa fa-minus-circle delete-point\" aria-hidden=\"true\" style=\"color:red;float:right\" onclick= \"deletePoint(this,event)\"></i>");
          // $td.append($font.append("<br>"));

          // $font= $("<font>").addClass("descfont").text(res[0].description);
          // $td.append($font.append("<br>"));

          // $font= $("<font>").addClass("addressfont").text(res[0].address);
          // $td.append($font.append("<br>"));

          // $tr.append($td);
          // $("#rightpane").find("table").append($tr);
        }
      })

      $div = $("<div>").attr("id","message");
      $div.css("display","none");
      $div.append($("<p>").text("Location Saved!"));
      $("#leftpane").append($div)

      messagewindow = new google.maps.InfoWindow({
        content: document.getElementById('message')
      });

      infowindow.close();
      infowindow = null;

      $('#message').css("display","block");
      messagewindow.open(map,marker);

      setTimeout(()=>{
        messagewindow.close();
        messagewindow = null;
      }, 1500);
    })
  }
}


