// ==UserScript==
// @name          YouTube Comment+
// @namespace     http://github.com/rap
// @description	  Extends the YouTube comment section to include a page goto form. I cannot imagine a single person beside myself ever needing this.
// @author        Stephen Swift
// @homepage      https://github.com/rap/YouTube-Comment-/raw/master/yt_comment_plus.js
// @include       http://*youtube.com*
// ==/UserScript==

var $;

// Add jQuery
(function(){
	if (typeof unsafeWindow.jQuery == 'undefined') {
		var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
			GM_JQ = document.createElement('script');

		GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
		GM_JQ.type = 'text/javascript';
		GM_JQ.async = true;

		GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
	}
	GM_wait();
})();

// Check if jQuery's loaded
function GM_wait() {
	if (typeof unsafeWindow.jQuery == 'undefined') {
		window.setTimeout(GM_wait, 100);
	} else {
		$ = unsafeWindow.jQuery.noConflict(true);
		letsJQuery();
	}
}

// All your GM code must be inside this function
function letsJQuery() {
	
	$( document ).ready( function() {
		// TODO: create this html with an object instead of with this parser
		var searchObject = createExtension();
		bindSearch( searchObject );
	});
	
	function createExtension() {
		searchBar = '';
		searchBar += '<div id="ytplus_wrapper">';
		searchBar += 	'
						<form id="form-ytplus_search">
							<input type="text" name="form-ytplus_search-page" id="form-ytplus_search-page" value="" style="background: #ffc8ef; border: 1px solid #96003c; height: 12px; padding: 4px; font: 12px arial;" />
							<button type="submit" style="background: #ffc8ef; border: 1px solid #96003c; height: 12px; padding: 6px; font: 12px arial;">Skip to Page</button
						</form>
		';	
		searchBar += '</div>';
		
		$( '.yt-uix-pager' ).append( searchBar );
		
		// here's my goofy solution to not wanting to parse youtube's own javascript:
		// clone the "next" button upon pageload, make an invisible clone of it.
		// change clone's values to give them input field's value
		var searchTrigger = $('.yt-uix-pager-link').clone(withDataAndEvents);
		searchTrigger.css('display', 'none').after( '#form-ytplus_search-page' );
		
		return searchTrigger;
	}
	
	function bindSearch( trigger ) {
		$( '#form-ytplus_search' ).bind( 'submit', function( event ) {
			var pageNum = $( '#form-ytplus_search-page' ).val();
			if( isInt( pageNum ) ) {
				var hrefArray = trigger.attr( 'href' );
				var hrefPiece = hrefArray[ parseInt( hrefArray.length ) - 1 ];
				hrefArray.pop();
				hrefArray.push( hrefPiece );
				// seriously, are we grabbing the right thing?
				console.log( hrefPiece, hrefArray );
				
				trigger.attr( {
					'data-page' : pageNum,
					'href' : hrefPiece
				} ).click();
 				
			}
			event.preventDefault();
		});
	}
	
	function is_int( input ){
		return typeof( input ) == 'number' && parseInt( input ) == input;
	}	
}