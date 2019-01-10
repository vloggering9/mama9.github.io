
/*** Constant used by yasr

yasrCommonData (postid, ajaxurl, loggedUser, visitorStatsEnabled, loaderHtml, tooltipValues, jquery_disabled')

yasrMultiSetData (setType, nonce)


***/


/****** Do this actions on document load ******/
document.addEventListener('DOMContentLoaded', function(event) {

    //Functions on load for rater, only if enabled

    if (yasrCommonData.jquery_disabled === 'yes') {

        //At pageload, check if there is some shortcode with class yasr-rater-stars
        var yasrRaterInDom = document.getElementsByClassName('yasr-rater-stars');
        //If so, call the function to set the rating
        if (yasrRaterInDom.length > 0) {

            //load this on everypageload
            yasrSetRatingOnLoad(yasrRaterInDom);

        }

        //check if shortcode yasr_visitor_votes is used
        var yasrRaterVVInDom = document.getElementsByClassName('yasr-rater-stars-visitor-votes');

        if (yasrRaterVVInDom.length > 0) {
            yasrVisitorVotesFront(yasrRaterVVInDom);
        }

        /*var yasrMultiSetVisitorInDom = document.getElementsByClassName('yasr-multiset-visitors-rater');

        if (yasrMultiSetVisitorInDom.length > 0) {

            yasrRaterVisitorsMultiSet (yasrMultiSetVisitorInDom)

        }*/

    }

    //if is defined yasrVisitorsVotesData means that the shortcode is used
    if (typeof yasrVisitorsVotesData !== 'undefined') {

        yasrVisitorsVotes ();

    }

    //Check to draw tooltips
    if (yasrRaterVVInDom || typeof yasrVisitorsVotesData !== 'undefined') {

        if (yasrCommonData.visitorStatsEnabled == 'yes') {

            var yasrStatsInDom = document.getElementsByClassName('yasr-dashicons-visitor-stats');

            if (yasrStatsInDom) {
                yasrDrawTipsProgress (yasrStatsInDom);
            }

        }

    }

    if (typeof yasrMultiSetData !== 'undefined') {
        yasrVisitorsMultiSet ();
    }

    if (typeof yasrMostHighestRanking !== 'undefined') {

        //By default, hide the highest rated chart
        document.getElementById('yasr-highest-rated-posts').style.display = 'none';

    }

});



/***** Functions for rateit shortcode *****/

/*** Yasr visitor Votes ***/

function yasrVisitorsVotes () {

    jQuery('.rateit').bind('over', function (event, value) { jQuery(this).attr('title', yasrCommonData.tooltipValues[value-1]); });

    //on vote...
    jQuery('.yasr_visitor_votes_stars_div').on('rated', function() {

        var el = jQuery(this);
        var value = el.rateit('value');
        var value = value.toFixed(1); //

        var postid = jQuery( this ).data('postid');
        var classSize = jQuery( this ).attr('class');

        var voteIfUserAlredyRated = jQuery('#yasr-user-vote-'+postid).data('yasr-already-voted');

        if (value < 1) {
            jQuery('#yasr_visitor_votes_' + postid).html('You can\'t vote 0');
        }

        else {

            jQuery('#yasr_visitor_votes_' + postid).html(yasrCommonData.loaderHtml);

                var data = {
                    action: 'yasr_send_visitor_rating',
                    rating: value,
                    post_id: postid,
                    size: classSize,
                    nonce_visitor: yasrVisitorsVotesData.nonceVisitor
                };

            //Send value to the Server
            jQuery.post(yasrCommonData.ajaxurl, data, function(response) {
                //response
                jQuery('#yasr_visitor_votes_' + postid).html(response);
                jQuery('.rateit').rateit();

            }) ;

        } //End else value <1

    });//End function insert/update vote


}
/*** End Yasr Visitor Votes ***/

function yasrVisitorsMultiSet () {

    //will have field id and vote
    var ratingObject = "";

    //an array with all the ratingonjects
    var ratingArray = [];

    var postId = yasrCommonData.postid;
    var setType = yasrMultiSetData.setType;
    var nonce = yasrMultiSetData.nonceVisitor;

    jQuery('.yasr-visitor-multi-'+postId+'-'+setType).on('rated', function() {
        var el = jQuery(this);
        var value = el.rateit('value');
        var value = value.toFixed(1);
        var idField = el.attr('id');

        ratingObject = {
            field: idField,
            rating: value
        };

        //creating rating array
        ratingArray.push(ratingObject);

    });

    jQuery('#yasr-send-visitor-multiset-'+postId+'-'+setType).on('click', function() {

        jQuery('#yasr-send-visitor-multiset-'+postId+'-'+setType).hide();

        jQuery('#yasr-loader-multiset-visitor-'+postId+'-'+setType).show();

        var data = {

            action: 'yasr_visitor_multiset_field_vote',
            nonce: nonce,
            post_id: postId,
            rating: ratingArray,
            set_type: setType

        };

        //Send value to the Server
        jQuery.post(yasrCommonData.ajaxurl, data, function(response) {
            jQuery('#yasr-loader-multiset-visitor-'+postId+'-'+setType).text(response);
        });

    });

} //End function


//This work on top10 ranking chart, show the highest rated and hide most rated
function yasrShowHighest () {

    document.getElementById('yasr-most-rated-posts').style.display = 'none';

    document.getElementById('yasr-highest-rated-posts').style.display = '';

}

//Vice versa
function yasrShowMost () {

    document.getElementById('yasr-highest-rated-posts').style.display = 'none';

    document.getElementById('yasr-most-rated-posts').style.display = '';

}


/****** End Yasr shortcode page  ******/


/****** Tooltip function ******/

//used in shortcode page and ajax page
function yasrDrawTipsProgress (yasrStatsInDom) {

    //htmlcheckid declared false
    var htmlIdChecked = false;

    for (var i = 0; i < yasrStatsInDom.length; i++) {

        (function (i) {

            var htmlId = '#'+yasrStatsInDom.item(i).id;
            var postId = yasrStatsInDom.item(i).getAttribute('data-postid');

            var data = {
                action: 'yasr_stats_visitors_votes',
                post_id: postId
            };

            //Convert in a string
            //var dataToSend = jsObject_to_URLEncoded(data);

            var initialContent = '<span style="color: #0a0a0a">Loading...</span>';

            tippy(htmlId, {
                content: initialContent,
                theme: 'yasr',
                arrow: 'true',
                arrowType: 'round',

                //When support for IE will be dropped out, this will become onShow(tip)
                onShow: function onShow(tip) {

                    if (htmlId !== htmlIdChecked) {

                        jQuery.post(yasrCommonData.ajaxurl, data, function (response) {
                            response = JSON.parse(response);
                            tip.setContent(response);

                        });
                    }

                },
                onHidden: function onHidden() {
                    htmlIdChecked = htmlId;
                }

            });

            /**** This code works but not with IE ****/

            /*const state = {
                isFetching: false,
                canFetch: true
            }

            //Create a new request
            var yasrVVAjaxCall = new Request(yasrCommonData.ajaxurl, {
                method: 'post',
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                }),
                body: dataToSend
            });

            tippy(this, {
                content: initialContent,
                theme: 'yasr',


                onShow(tip) {
                    if (state.isFetching || !state.canFetch) return

                    state.isFetching = true
                    state.canFetch = false

                    if (htmlId !== htmlIdChecked) {

                        try {
                            fetch(yasrVVAjaxCall)
                                .then(checkResponse)
                                .then(function (response) {
                                    //return the new average rating
                                    return response.json();
                                })

                                .then(function (data) {
                                    tip.setContent(data);
                                })
                                .catch(function (err) {
                                    console.log('Error with ajax call', err);
                                });
                        }
                        catch (e) {
                            tip.setContent("Fetch failed. ${e}")
                        } finally {
                            state.isFetching = false
                        }
                    }

                },
                onHidden(tip) {
                    state.canFetch = true
                    htmlIdChecked = htmlId;
                }
            })*/

         })(i);

    }

}



/****** End tooltipfunction ******/


// this should give support for all plugin that add content with ajax
jQuery( document ).ajaxComplete(function() {

    jQuery('.rateit').rateit();

});



/****  ****/

//this is the function that print the overall rating shortcode, get overall rating and starsize
function yasrSetRaterValue (starSize, htmlId) {

    //convert to be a number
    starSize = parseInt(starSize);

    raterJs({
        starSize: starSize,
        step: 0.1,
        showToolTip: false,
        readOnly: true,
        element: document.getElementById(htmlId),
    });

}

function yasrSetRatingOnLoad (yasrRatingsInDom) {

    //Check in the object
    for (var i = 0; i < yasrRatingsInDom.length; i++) {

        var htmlId = yasrRatingsInDom.item(i).id;
        var starSize = yasrRatingsInDom.item(i).getAttribute('data-rater-starsize');

        yasrSetRaterValue(starSize, htmlId);

    }

}

function yasrVisitorVotesFront (yasrRaterVVInDom) {

    //Check in the object
    for (var i = 0; i < yasrRaterVVInDom.length; i++) {

        (function(i) {

            var postId = yasrRaterVVInDom.item(i).getAttribute('data-rater-postid');
            var htmlId = yasrRaterVVInDom.item(i).id;
            var starSize = parseInt(yasrRaterVVInDom.item(i).getAttribute('data-rater-starsize'));
            var readonly = yasrRaterVVInDom.item(i).getAttribute('data-rater-readonly');
            var nonce = yasrRaterVVInDom.item(i).getAttribute('data-rater-nonce');

            //Convert string to boolean
            readonly = yasrReadonlyConvertion(readonly);

            raterJs({
                starSize: starSize,
                step: 1,
                showToolTip: false,
                readOnly: readonly,
                element: document.getElementById(htmlId),

                rateCallback: function rateCallback(rating, done) {

                    //show the loader
                    document.getElementById('yasr_visitor_votes_' + postId).innerHTML = yasrCommonData.loaderHtml;

                    //Just leave 1 number after the .
                    rating = rating.toFixed(1);
                    //Be sure is a number and not a string
                    rating = parseFloat(rating);

                    //Creating an object with data to send
                    var data = {
                        action: 'yasr_send_visitor_rating',
                        rating: rating,
                        post_id: postId,
                        size: starSize,
                        nonce_visitor: nonce
                    };

                    //Send value to the Server
                    jQuery.post(yasrCommonData.ajaxurl, data, function (response) {
                        //decode json
                        response = JSON.parse(response);
                        document.getElementById('yasr_visitor_votes_' + postId).innerHTML = response;
                        raterJs({
                            starSize: starSize,
                            step: 1,
                            showToolTip: false,
                            rating: rating,
                            readOnly: true,
                            element: document.getElementById(htmlId)
                        });

                    });

                    done();

                    /* This code is working, but doesn't support IE

                    //Convert in a string
                    var dataToSend = jsObject_to_URLEncoded(data);

                    //Create a new request
                    var yasrVVAjaxCall = new Request(yasrCommonData.ajaxurl, {
                        method: 'post',
                        headers: new Headers({
                            "Content-Type": "application/x-www-form-urlencoded"
                        }),
                        body: dataToSend
                    });

                    //Do the ajax call
                    fetch(yasrVVAjaxCall)
                        .then(checkResponse)
                        .then(function (response) {
                            //return the new average rating
                            return response.json();
                        })

                        .then(function (data) {

                            document.getElementById('yasr_visitor_votes_' + postId).innerHTML = data;

                            raterJs({
                                starSize: starSize,
                                step: 1,
                                showToolTip: false,
                                rating: rating,
                                readOnly: true,
                                element: document.getElementById(htmlId)
                            });

                        })
                        .then(done)
                        .catch(function (err) {
                            console.log('Error with ajax call', err);
                        });*/

                }

            });

        })(i);

    }//End for

}

/*function yasrRaterVisitorsMultiSet (yasrMultiSetVisitorInDom) {

    var sendButton = [];

    //will have field id and vote
    var ratingObject = "";

    //an array with all the ratings objects
    var ratingArray = [];

    //Check in the object
    for (var i = 0; i < yasrMultiSetVisitorInDom.length; i++) {

        (function (i) {

            var postId = parseInt(yasrMultiSetVisitorInDom.item(i).getAttribute('data-rater-postid'));
            var htmlId = yasrMultiSetVisitorInDom.item(i).id;
            var readonly = yasrMultiSetVisitorInDom.item(i).getAttribute('data-rater-readonly');
            var setId = parseInt(yasrMultiSetVisitorInDom.item(i).getAttribute('data-rater-setid'));

            //create an array for the id of the send buttons
            if (!sendButton.includes('yasr-send-visitor-multiset-' + postId + '-' + setId)) {
                sendButton.push('yasr-send-visitor-multiset-' + postId + '-' + setId);
            }

            readonly = yasrReadonlyConvertion(readonly);

            var elem = document.querySelector("#" + htmlId);
            raterJs({
                starSize: 16,
                step: 1,
                showToolTip: false,
                readOnly: readonly,
                element: elem,

                rateCallback: function rateCallback(rating, done) {

                    setIdField = elem.getAttribute('data-rater-set-field-id');

                    //Just leave 1 number after the .
                    rating = rating.toFixed(1);
                    //Be sure is a number and not a string
                    var vote = parseInt(rating);

                    this.setRating(vote); //set the new rating

                    /*if (!ratingArray.includes(postId)) {
                        ratingArray.push([postId]);
                    }*/

/*
                    ratingObject = {
                        post_ID: postId,
                        field: setIdField,
                        rating: vote
                    };

                    //creating rating array
                    ratingArray.push(ratingObject);

                    console.log(ratingArray);

                    done();

                }

            });

        })(i);

    }

    for (var j=0; j < sendButton.length; j++) {

        (function (j) {

            var yasrButtonVisitorVotes = document.getElementById(sendButton[j]);

            yasrButtonVisitorVotes.addEventListener('click', function () {

                console.log(sendButton[j]);

                //show the loader
                //document.getElementById(sendButton[j]).innerHTML = '<strong>test</strong>';

                /*var data = {

                    action: 'yasr_visitor_multiset_field_vote',
                    nonce: nonce,
                    post_id: postId,
                    rating: ratingArray,
                    set_type: setType

                };*/

                /*
                //Send value to the Server
                jQuery.post(yasrCommonData.ajaxurl, data, function(response) {
                    jQuery('#yasr-loader-multiset-visitor-'+postId+'-'+setType).text(response);
                });*/

            /*});

        })(j);

    }
    
} //End function */

/***** Function to convert js object (literal  object) to string used for ajax calls in vanilla js ****/
function jsObject_to_URLEncoded(element, key, list){
    var list = list || [];
    if(typeof(element)=='object'){
        for (var idx in element)
            jsObject_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
    } else {
        list.push(key+'='+encodeURIComponent(element));
    }
    return list.join('&');
}


/**** function to check ajax response *****/
function checkResponse(res) {
    if (res.status >= 400 && res.status < 600) {
        throw new Error("Failed with status ${res.status}");
    }

    return res;
}

function yasrReadonlyConvertion(readonly) {

    if (typeof readonly === 'undefined' || readonly === null) {
        readonly = true;
    }

    //Convert string to boolean
    if (readonly === 'true') {
        readonly = true;
    }
    if (readonly === 'false') {
        readonly = false;
    }

    return readonly;

}
