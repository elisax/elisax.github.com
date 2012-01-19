$(document).ready( function(){
    
    $().elisa();
        
    // if regular donation selected then pass cookies by post to edirectdebit.com
    $('#webform-client-form-20').submit(function(){
        if($('input[value=regular]:radio').is(':checked')){
            _gaq.push(['_linkByPost',this]);
        }
    });
    
});

(function($){
    
    $.fn.elisa = function(options) {
        
        var elisa = {

            options: {
                trackFileDownloads: 	true,
                trackExitLinks:     	true,
                trackRSSLinks:      	true,
                trackEmailLinks:    	true,
                trackSocial:      		true,   
                
                regexFileTypes:         /^.+\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i, 
                regexInternalTraffic:   /(merlin\.org\.uk)/i, 
                regexRSSLinks:          /(\/feed)/i,
                
                prefixFileDownload: 	'File Download',
                prefixExitLink:     	'Exit Links',
                prefixRSSLink:      	'Rss Links',
                prefixEmailLink:    	'Email Links',
                
                isAsync: true
            },
        
            pageTrackerFound: false,        
            host: window.location.host.toLowerCase(),

            init: function( optionOverrides ) {
                
                if(optionOverrides)
                    $.extend( this.options, optionOverrides );
                
                if( typeof( _gaq ) == 'undefined' && this.options.isAsync ) return;
                if( typeof( pageTracker ) == 'undefined' && !this.options.isAsync ) return;
                pageTrackerFound = true;
                
				
				
                this.processPageLinks( this.options );
                
                if( this.options.trackSocial) {
					this.trackSocialTwitter();
                    
					this.trackSocialFacebook('edge.create', 'Like');
                    this.trackSocialFacebook('edge.remove', 'Unlike');
                    this.trackSocialFacebook('message.send', 'Share');
                }	
                
            },    
            
            processPageLinks: function( opt ) {
            
                $('a[href]').each( function() {
                
                    var href = $(this).attr('href');
					var text = $(this).text()	    

                    // START CUSTOM CODE
                    // Track youtube links
                    if (opt.trackExitLinks && href.match(/youtube.com\/watch/) )
                    {
                        //alert('exit -> '+href);
						elisa.trackEvent( this, 'Videos', $(this).attr('title'), href.replace(/^https?\:\/\//i, '') );
                        return;
                    }
                    // END CUSTOM CODE
                
                    // Track exit links
                    else if (opt.trackExitLinks && href.match(/^https?\:/) && !href.match(opt.regexInternalTraffic))
                    {
                        //alert('exit -> '+href);
						elisa.trackEvent( this, opt.prefixExitLink, href.replace(/^https?\:\/\//i, ''), text );
                        return;
                    }
                    
                    // Track email links - mailto
                    else if (opt.trackEmailLinks && href.match(/^mailto\:/i))
                    {     
                        //alert('mail -> '+href);
						elisa.trackEvent( this, opt.prefixEmailLink, href.replace(/^mailto\:/i, ''), text );	
                        return;
                    }
                    
                    // Track file downloads
                    else if (opt.trackFileDownloads && href.match(opt.regexFileTypes))
                    {     
                        //alert($(this).text());   
                		elisa.trackEvent( this, opt.prefixFileDownload, href.replace(/^https?\:\/\//i,''), text );
                        return;
                    }
                    
                    // Track rss links
                    else if (opt.trackRSSLinks && href.match(opt.regexRSSLinks))
                    {     
                        //alert(href.match(opt.regexRSSLinks));   
                		elisa.trackEvent( this, opt.prefixRSSLink, href.replace(/^https?\:\/\//i,''), text );
                        return;
                    }
                    
                } );
            
            },
            
            trackSocialFacebook: function( event, action, opt_pageUrl ) {
          
                if (FB && FB.Event && FB.Event.subscribe) {
                
                	FB.Event.subscribe(event, function(targetUrl) {
                    	_gaq.push(['_trackSocial', 'Facebook', action, targetUrl, opt_pageUrl]);
                	});
				}
                 
            },

			trackSocialTwitter: function() {
				
				twttr.events.bind('tweet', function(event) {
				  if (event) {
				    var targetUrl;
				    if (event.target && event.target.nodeName == 'IFRAME') {
				      targetUrl = elisa.extractParamFromUri(event.target.src, 'url');
				    }
				    _gaq.push(['_trackSocial', 'Twitter', 'Tweet', targetUrl]);
				  }
				});
			},
			
			extractParamFromUri: function(uri, paramName) {
			  if (!uri) {
			    return;
			  }
			  var uri = uri.split('#')[0];  // Remove anchor.
			  var parts = uri.split('?');  // Check for query params.
			  if (parts.length == 1) {
			    return;
			  }
			  var query = decodeURI(parts[1]);

			  // Find url param.
			  paramName += '=';
			  var params = query.split('&');
			  for (var i = 0, param; param = params[i]; ++i) {
			    if (param.indexOf(paramName) === 0) {
			      return unescape(param.split('=')[1]);
			    }
			  }
			},
            
            trackEvent: function(link, category, action, title) {
                
                if(!pageTrackerFound) return;
                
                $(link).click(function() {
                    
                    if (elisa.options.isAsync) { 
						//alert(pageUrl);
						_gaq.push(['_trackEvent', category, action, title]);
                    }
                });
            }
            
        };
        elisa.init(options,this);
        
    }
})( jQuery );
