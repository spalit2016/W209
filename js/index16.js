console.log('enter');
var width = 750,
    height = 750;

var d3Svg = d3.select( "#graph1" )
  .append( "svg" )
  .attr('id', 'd3Data')
  .attr( "width", width )
  .attr( "height", height );

var d3G = d3Svg.append( "g" );
var markersG = d3Svg.append("g");

var albersProjection = d3.geoAlbers()
  .scale( 100000 )
  .rotate( [74.006,0] )
  .center( [0, 40.712] )
  .translate( [width/2,height/2] );

var latLongProjection = d3.geoMercator()
  .scale(width / 2 / Math.PI)
  .translate( [width/2,height/2] );

var geoPath = d3.geoPath()
    .projection( albersProjection )
    .pointRadius(1);

function click(a){
    window.location.assign("https://www1.nyc.gov/html/dot/html/motorist/wkndtraf.shtml#"+a.replace(/\s/g, '').toLowerCase());
 };

function highlight(b){
    var className = '.borough-' + b.id;
    $('.borough-point').css('opacity', 0);
    $(className).css('opacity', 1);
}

var url = 'data/nynta.json';



//var color=d3.scaleSequential(d3.interpolateReds)


var geojson = null;
function plotMap() {
    selectedYear = $('#Dropdown select').val();
    var sum = 0;
    var max = 0;
    if (geojson) {
        geojson.features.forEach(function(feature) {
            value = feature.properties.accidents_by_year[selectedYear];
            if (value > max) {
                max = value;
            }
        });
        var myColor = d3.scaleLinear()
          .range(["white", "#0074D9"])
          .domain([1, value]);
        d3G.selectAll('path').remove();
        d3.selectAll('text').remove();
        d3G.selectAll( "path" )
          .data( geojson.features )
          .enter()
          .append( "path" )
          .attr( "d", geoPath )
          .attr( "fill", function(d) {
              value = d.properties.accidents_by_year[selectedYear];
              return myColor(value)
          });
        d3G.selectAll("text")
            .data(geojson.features)
            .enter()
            .append("text")
            .attr("transform", function (d) { return "translate(" + geoPath.centroid(d) + ")"; })
            .attr("dx", function (d) {
                if (d.properties.boro_name === 'Manhattan') {
                    return "-120px"
                }
                return d.properties.dx || "-60px";
            })
            .attr("dy", function (d) {
                return d.properties.dy || "0.35em";
            })
            .text(function (d) {
                return d.properties.boro_name + ' ( ' + d.properties.accidents_by_year[selectedYear] + ' )';
            });


            /*.attr("opacity",function(d,i) {
                return d.properties.accidents_by_year[selectedYear]*3/sum;
            })*/
    }
        /*.on("mouseover",function(d,i) { highlight(d); d3.select(this).attr("opacity",function(d,i) {
        return d.properties.accidents_count/(d.properties.population);console.log(d.properties.accidents_count/(d.properties.population));})
            })
        .on("click",function(d,i) { click(geojson.features[i].properties.BoroName);
            });*/
}

d3.json(url, function(error, json) {
console.log(json);
geojson = json;
plotMap();
});
//Add options to the dropdown list
//Define dropdown options
var month = [2016, 2017, 2018, 2019];

var dropdownButton = d3.select("#Dropdown")
                       .append("select");

dropdownButton
  .selectAll("option")
	.data(month)
  .enter()
	.append("option")
  .text(function (d) { return d; })
  .attr("value", function (d) { return d;conols.log(d); });

//Variables to store the selected option and filtered data
var a=2016;


//Call the chart with all data initially
update(a);

dropdownButton.on("change", function(d) {

  // recover the option that has been chosen
  a = d3.select(this).property("value");
 console.log(a);
  // run the update function with this selected option
  update(a);
});

function update(b){
/*var pointsUrl = 'data/points_'+a.toString()+'.json';
d3.json(pointsUrl, function(error, latLongPoints) {
    console.log(latLongPoints);
        markersG.selectAll("path")
            .data(latLongPoints.features)
            .enter()
            .append('path')
            .attr('fill', '#900')
            .attr('stroke', '#999')
            .attr('opacity',0)
            .attr('class', function(d) { return 'borough-point borough-' + d.properties.boroughId;})
            .attr('d', geoPath)
                .on("click",function(d,i) { d3.select(this).attr("fill", "blue");
        });
});*/
};

function showSelectedMonthAccidentsCount() {
    dropdownSelection = $('#Dropdown select').val();
    $('.accidents-count-row').hide();
    $('tr[data-year="' + dropdownSelection + '"]').show();
    plotMap();
}
//Handle the dropdown change event
dropdownButton.on("change", function(d) {

  // recover the option that has been chosen
  selectedOption = d3.select(this).property("value");

  // run the update function with this selected option
  update(selectedOption);
  showSelectedMonthAccidentsCount()
});

accidentsCountUrl = 'data/year_based_borough.csv'

d3.csv(accidentsCountUrl, function(error, accidentCounts) {
    accidentCounts.forEach(function(accidentCount) {
        var year = parseInt(accidentCount.year);
        var tableRow = '<tr class="accidents-count-row" data-year="' + year + '"><td>' + accidentCount.Borough + '</td><td>' + accidentCount['Accidents Count'] + '</td></tr>';
        $('.accidents-table-body').append(tableRow);
    });
  showSelectedMonthAccidentsCount()

});