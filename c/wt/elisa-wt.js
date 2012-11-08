/*
* Elisa JS version 0.9
* The Woodland Trust
*/

$(document).ready( function(){
    
    $().elisa();
    
    
    // Set bounce rate timeout
    setTimeout("_gaq.push(['_trackEvent', 'Bounce Rate Timeout', '15 seconds'])", 15000);
    
    // Count user registrations on woodlandtruts.org.uk
    if(document.referrer.match(/registration\.woodland-trust\.org\.uk/i) && $('#ctl00_welcomeMessage').length > 0 )
    {
	    _gaq.push(['_trackEvent', 'Users', 'woodlandtrust.org.uk user registration']);
    }
    
    // Count user registrations on woodlandtrustshop.com/register.aspx
    if(  window.location.href.match(/woodlandtrustshop\.com\/register\.aspx/i) )
    {
    	if ($('div .section-body p span').text() == 'Your registration completed')
    	    {
		_gaq.push(['_trackEvent', 'Users', 'woodlandtrustshop.com user registration']);
	    }
    }
    
    // Search results on visitwoods.org.uk
    if(  window.location.href.match(/visitwoods\.org\.uk\/en\/visit-woods\/pages\/search-result\.aspx/i) )
    {	
	text = $('#tableResults .search-info').text();
    	if(text.match(/Your search did not return any results|Your search returned 0 woods/))
    		result = '0';
    	else
    		result = text.match(/[0-9]+/).toString();
    		
	    _gaq.push(['_trackEvent', 'Visit Woods: Search', $('span input.autoselect').val(), result]);
    }
    
    // Visit Woods - upload image
    $('.image-metadata-panel input[name="saveImages"]').click(function(e)
    {
        text = $('.image-metadata-panel h2').text();
	text = text.slice(text.indexOf('to ')+3,text.indexOf(',')).toString();
        _gaq.push(['_trackEvent', 'Visit Woods', 'Upload Image', text]);
    });

    // Visit Woods - post a comment
    $('.div-visit-woods-add-comment-panel-container input[title="Post your comment"]').click(function(e)
    {
        text = $('.div-visit-woods-add-comment-panel-container h2').text();
	    text = text.slice(text.indexOf('to ')+3,text.indexOf(',')).toString();
        _gaq.push(['_trackEvent', 'Visit Woods', 'Post Comment', text]);
    });


    // Visit Woods - upload video
    $('.div-visit-woods-upload-video-panel-container input[title="Upload a video"]').click(function(e)
    {
        text = $('.div-visit-woods-upload-video-panel-container h2').text();
	    text = text.slice(text.indexOf('to ')+3,text.indexOf(',')).toString();
        _gaq.push(['_trackEvent', 'Visit Woods', 'Upload Video', text]);
    });
    
      
});

(function($){
    
    $.fn.elisa = function(options) {
        
        var elisa = {

            options: {
                trackFileDownloads: 	true,
                trackExitLinks:     	true,
                trackEmailLinks:    	true,
                trackSocial:      		true,
                trackCrossDomains:      true,
                
                regexInternalTraffic:   new RegExp(window.location.hostname, 'i'),                                
                regexFileTypes:         /^.+\.(doc|docx|xls|xlsx|ppt|pptx|zip|pdf)$/i, 
                regexCrossDomains:  /ancient-tree-hunt\.org\.uk|backonthemap\.org\.uk|british-trees\.com|dedicatetrees\.com|naturedetectives\.org\.uk|naturescalendar\.org\.uk|visitwoods\.org\.uk|woodlandtrust\.org\.uk|woodlandtrustshop\.com|wt-store\.com|woodland-trust\.org\.uk|treedisease\.co\.uk/i,
                
                prefixFileDownload: 	'File Download',
                prefixExitLink:     	'Exit Links',
                prefixEmailLink:    	'Email Links',
                
                isAsync: true
            },

            init: function( optionOverrides ) {
                
                if(optionOverrides) $.extend( this.options, optionOverrides );
                
                if( typeof( _gaq ) == 'undefined' && this.options.isAsync ) return;
                if( typeof( pageTracker ) == 'undefined' && !this.options.isAsync ) return;
                
                this.processPageLinks( this.options );
                this.processPageForms( this.options );
                
                if( this.options.trackSocial) {
					this.trackSocialTwitter();
                    
					this.trackSocialFacebook('edge.create', 'Like');
                    this.trackSocialFacebook('edge.remove', 'Unlike');
                    this.trackSocialFacebook('message.send', 'Share');
                }	
                
            },
            
            /* PROCESS PAGE FUNCTIONS */
            
            processPageLinks: function( opt ) {
            
                $('a[href]').each( function() {
                
                    var href = $(this).attr('href');
					var text = $(this).text();
					
                    
                    if (href.match(/^https?\:/i) && !href.match(opt.regexInternalTraffic) )
                    {
                        // Track cross domain
                        if(opt.trackCrossDomains && href.match(opt.regexCrossDomains) ) 
                        {
                            elisa.trackCrossDomain( this );	
                            return;
                        }
                        
                        // Track exit links
                        else if(opt.trackExitLinks) 
                        {
                            elisa.trackEvent( this, opt.prefixExitLink, href.replace(/^https?\:\/\//i, ''), text );
                            return;   
                        }
                        
                    }
                    
                    // Track email links
                    else if (opt.trackEmailLinks && href.match(/^mailto\:/i))
                    {     
						elisa.trackEvent( this, opt.prefixEmailLink, href.replace(/^mailto\:/i, ''), text );	
                        return;
                    }
                    
                    // Track file downloads
                    else if (opt.trackFileDownloads && href.match(opt.regexFileTypes))
                    {       
                		elisa.trackEvent( this, opt.prefixFileDownload, href.replace(/^https?\:\/\//i,''), text );
                        return;
                    }
                    
                    
                });
            
            },
            
            processPageForms: function( opt ) {
                
                $('form').each( function() {
                 
                    var action = $(this).attr('action');

                    // Track cross domain
                    if (opt.trackCrossDomains && action.match(/^https?\:/i) && action.match(opt.regexCrossDomains) && !action.match(opt.regexInternalTraffic) )
                    {     
    					elisa.trackCrossDomain( this );	
                        return;
                    }
                    
                });
    
            },
            
            
            /* TRACK FUNCTIONS */
            
            trackSocialFacebook: function( event, action, opt_pageUrl ) {
          
                if (typeof FB === 'undefined') return;
                
            	FB.Event.subscribe(event, function(targetUrl) {
                	_gaq.push(['_trackSocial', 'Facebook', action, targetUrl, opt_pageUrl]);
            	}); 
            },

			trackSocialTwitter: function() {
				
				if (typeof twttr === 'undefined') return;
				
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
			  var uri = uri.split('#')[0];
			  var parts = uri.split('?');
			  if (parts.length == 1) {
			    return;
			  }
			  var query = decodeURI(parts[1]);
			  paramName += '=';
			  var params = query.split('&');
			  for (var i = 0, param; param = params[i]; ++i) {
			    if (param.indexOf(paramName) === 0) {
			      return unescape(param.split('=')[1]);
			    }
			  }
			},
            
            trackEvent: function(link, category, action, label) {
                
                $(link).click(function() {
                    
                    if (elisa.options.isAsync) { 
                        _gaq.push(['_trackEvent', category, action, label]);
                    }
                });
            },
            
            trackCrossDomain: function(obj) {
                
                // Track Links
                if(typeof obj.href !== 'undefined') {
                    
                    $(obj).click(function(e) {

                        _gaq.push(['_link', obj.href]);
                        return false;

                    });
                    
                } 
                
                // Track Forms (works only when method = post)
                else if(typeof obj.action !== 'undefined') {
                
                    $(obj).submit(function() {
                    
                        _gaq.push(['_linkByPost', obj]);
                
                    });
                }

            },
            
        };
        elisa.init(options,this);
        
    }
})( jQuery );
