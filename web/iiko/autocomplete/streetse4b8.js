/*jslint  browser: true, white: true, plusplus: true */
/*global $, streets */

var arStreets = false;
var allStreetsRegion;

$(function () {
    'use strict';

	var streetsArray, arStreets, streets;

	$.getJSON( "/local/templates/bd_sushi_shop_default/js/street.json", function( streetsByCities ) {	  
	  allStreetsRegion = streetsByCities;

      if( typeof currentCity != 'undefined' && typeof streetsByCities[currentCity] != 'undefined' )	
		streets = streetsByCities[currentCity];
	  else
		streets = streetsByCities['minsk'];
	
	  var streetsArray = $.map(streets, function (value, key) { return { value: value, data: key }; });
	  window.arStreets = Object.keys(streets).map(function (key) {return streets[key]});
	
      /*if( currentCity == 'minsk' ){
        $.each(streetsByCities, function(i, e){
            if( i.indexOf('minsk-') >= 0 ){
                $('.type_region').append($("<option value=\""+i.substr(6)+"\">"+i.substr(6)+"<option>"));
                $('.type_region').chosen('destroy').chosen({disable_search_threshold:10});
            }
        });
      }*/

      $('.type_region').on('change', function(){
        reinitAutocomplete($(this).val().toLowerCase());
      });

	  initAutocomplete(streetsArray);
	});
});

function reinitAutocomplete(currValue){
    $('#autocomplete-ajax').val('');
    // arStreets = Object.keys(allStreetsRegion['minsk-'+currValue]).map(function (key) {return allStreetsRegion['minsk-'+currValue][key]});
    // initAutocomplete($.map(allStreetsRegion['minsk-'+currValue], function (value, key) { return { value: value, data: key }; }));
    var city = "Минск";
    if( currValue == "brest" )
        city = "Брест";

    $('input.city').val(city);
    arStreets = Object.keys(allStreetsRegion[currValue]).map(function (key) {return allStreetsRegion[currValue][key]});
    initAutocomplete($.map(allStreetsRegion[currValue], function (value, key) { return { value: value, data: key }; }));
}

function initAutocomplete(streetsArray){
	// Initialize ajax autocomplete:
    $('#autocomplete-ajax').autocomplete({
        // serviceUrl: '/autosuggest/service/url',
        lookup: streetsArray,
        lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        onSelect: function(suggestion) {
            $('#selction-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
        },
        onHint: function (hint) {
            $('#autocomplete-ajax-x').val(hint);
        },
        onInvalidateSelection: function() {
            $('#selction-ajax').html('You selected: none');
        }
		//App: "#test"
    });
}
