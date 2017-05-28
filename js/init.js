(function($){
  $(function(){

    $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    });

    $('.parallax').parallax();
    $('.scrollspy').scrollSpy({scrollOffset: 0});
    $('.materialboxed').materialbox();

    initD3();
    $(window).scroll(function(){
      var scrollTop = $(window).scrollTop();
      $( ".parallaxDiv" ).css( "background-position", '-150px '+(-scrollTop/2)+"px" );
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space

initD3 = function(){
  var n = 20, // number of layers
  m = 200, // number of samples per layer
  k = 10; // number of bumps per layer

  var stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle)

  var layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); })))

  var layers1 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); })))

  var layers = layers0.concat(layers1);

  var svg = d3.select("svg"),
  width = $('svg').width(),
  height = $('svg').height();

  var x = d3.scaleLinear()
  .domain([0, m - 1])
  .range([0, width]);

  var y = d3.scaleLinear()
  .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
  .range([height, 0]);

  var z = d3.interpolateCool;

  var area = d3.area()
  .x(function(d, i) { return x(i); })
  .y0(function(d) { return y(d[0]); })
  .y1(function(d) { return y(d[1]); });

  svg.selectAll("path")
  .data(layers0)
  .enter().append("path")
  .attr("d", area)
  .attr("fill", function() { return z(Math.random()); });

  function stackMax(layer) {
    return d3.max(layer, function(d) { return d[1]; });
  }

  function stackMin(layer) {
    return d3.min(layer, function(d) { return d[0]; });
  }

  function transition() {
    console.log('run transition');
    var t;
    d3.selectAll("path")
    .data((t = layers1, layers1 = layers0, layers0 = t))
    .transition()
    .duration(2500)
    .attr("d", area);
  }

  // Inspired by Lee Byron’s test data generator.
  function bumps(n, m) {
    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < m; ++i) bump(a, n);
    return a;
  }

  function bump(a, n) {
    var x = 1 / (0.1 + Math.random()),
    y = 2 * Math.random() - 0.5,
    z = 10 / (0.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  setInterval(transition, 2000);
}
