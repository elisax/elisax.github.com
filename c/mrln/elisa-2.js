// donate.merlin.org.uk

$('#webform-client-form-20').submit(function(){
    
    if($('input[value=regular]:radio').is(':checked')){
        
        _gaq.push(['_linkByPost',this]);
    }
    
});