

$(document).ready(function(){


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

  $("#new-list").click(() => {
   window.location.href="/api/users/newlist";
  })

});
