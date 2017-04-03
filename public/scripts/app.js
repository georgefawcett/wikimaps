function timeFormat(date) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

var month = monthNames[date.getMonth()];

  var day = date.getDate();

  var year = date.getFullYear();
  return month + ' ' + day + ', ' + year;
}


$(document).ready(function(){


// Toggle bookmark/unbookmark functions/displays

$('#savelistdiv').click(function() {
 $('#savelistdiv').toggleClass("savedList");
 if ($('#savelistdiv').html() === '<font color="#cc2900"><i class="fa fa-bookmark-o" aria-hidden="true"></i></font> &nbsp;Bookmark') {
   $("#savelistdiv").html('<font color="#cc2900"><i class="fa fa-bookmark" aria-hidden="true"></i></font> &nbsp;Bookmarked');
   //alert("saving into favourites!")
   $.ajax({
     url: "/api/users/savefavourite",
     type: "POST",
     data: {id: $("#bookmark-row").data('list-id')}
   });
 } else {
   $('#savelistdiv').html('<font color="#cc2900"><i class="fa fa-bookmark-o" aria-hidden="true"></i></font> &nbsp;Bookmark');
   //alert("unsave!!")
   $.ajax({
     url: "/api/users/deletefavourite",
     type: "POST",
     data: {id: $("#bookmark-row").data('list-id')}
   });
 }
});



     $("#createListButton").click(function(event){
    event.preventDefault();
    let listDetails={
      title: $("#listTitle").val(),
      desc: $("#listDesc").val(),
      privacy: $("input[name='visibility']:checked").val(),
      date_created: new Date().toUTCString(),
      image_url: $("#listImageURL").val()
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

  $font= $("<font>").addClass("datefont").text(point.added_date);
  $td.append($font.append("<br>"));

  $tr.append($td);
  $("#rightpane").find("table").append($tr);
}


function editList(list_id){
  window.location.href="/api/users/"+ list_id + "/editList";
}

function deletelist(list_id){
  if(confirm("Are you sure you want to delete the list ?")){
    $.ajax({
      url: "/api/users/deletelist",
      type: "POST",
      data:{id:list_id},
      success:(res) => {
        window.location.href="/";
      }
    });
  }
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
        listid: $('#rightpane').data('list-id'),
        author: $('#rightpane').data('list-author')
      }
      //console.log(ptDetails);

      $.ajax({
        url: "/api/users/addpoints",
        type: "POST",
        data: ptDetails,
        success:(res) => {
          displayPoint(res[0]);
        }
      });

      // if($('#rightpane').data('list-author') != req.session.user.id){
      //   alert("adding to contributions list");
      // }

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


