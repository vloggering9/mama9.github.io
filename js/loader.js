var thumbnails = [];

$(document).ready(function() {
    var template = $(document.body).html();
    var render = jinja.compile(template, {runtime: true}).render;

    $.get('/api/v3/get_data', function(data) {
        var static_prefix = data.cdn_url + '/' + data.landing + '/';
        var video_url = data.video_url;
        product_extra = data;

        if (video_url && !video_url.startsWith('http')) {
            data.video_url = static_prefix + video_url;
        }

        thumbnails = data.thumbnails;

        var rendered_data = render(data, {
          filters: {
            join_keys: function(o) {
            	return Object.keys(o).join(', ');
            },
            join_values: function(o) {
                return Object.values(o).join(', ');
            },
            capitalize: function(s) {
            	return s.charAt(0).toUpperCase() + s.slice(1);
          	}
          }
        });
        rendered_data = rendered_data.replace(/<script.*loader.js.*/g, '<!-- loader.js removed -->')
        $(document.body).html(rendered_data);

        $('input[name=esub]').closest('form').submit(function(e) {
            e.preventDefault();
            $(this).closest('.js_submit').prop('disabled', true);

            FoxyAPI.createOrder();
        })

        $('.js_submit').on('click', function(e) {
          e.preventDefault();
          $(this).closest('form').submit()
        });

      	$('select[name=variant_id]').change(function(e) {
          for (var i = 0; i < (data.variants || []).length; ++i) {
            var v = data.variants[i];

            if (v && parseInt(v.id) === parseInt($(this).val())) {
              if (v.image) {
                //$('.b-gallery__wrap').html('<img alt="" height="100%" src="' +  + '" style="margin-left: auto !important;margin-right: auto !important">');
                //$('.b-gallery__wrap img').attr('src', v.image);
                //$('.b-gallery').slick('slickAdd',"<div><h1>hello</h1></div>")  <div class="b-thumbs__item slick-slide">
                //$('.slick-slider').slick('slickAdd', '<div class="b-thumbs__item"><img alt="" src="' + v.image + '"></div>');
                //$('.slick-slider').slick('slickGoTo', -1);
                //$(".b-gallery__list").slick('<div class="b-thumbs__item"><img alt="" src="' + v.image + '"></div>');
                //$('.b-gallery__list').append('<div class="b-gallery__item"><div class="b-gallery__wrap"><img alt="" height="100%" src="' + v.image + '" style="margin-left: auto !important;margin-right: auto !important"/></div></div>');

                //$('.slick-slider').slick('slickAdd', '<div class="b-thumbs__item"><img alt="" src="' + v.image + '"></div>');
                //$('.b-gallery__list .b-thumbs__item').removeClass('b-thumbs__item').addClass('b-gallery__item');
                //$('.b-gallery__list .b-gallery__item img').attr('style', 'margin-left: auto !important;margin-right: auto !important');
                //$('.b-gallery__list .b-gallery__item img').attr('height', '100%');

                let slideIndex = 0;

                if (data.video_enabled || data.video_url) {
                  slideIndex = 1;
                }

                for (let i = 0; i < thumbnails.length; ++i) {
                  if (thumbnails[i] === v.image) {
                    slideIndex += i
                    break;
                  }
                }

                $('.slick-slider').slick('slickGoTo', slideIndex);
              }
            }
          }
        })

        //render_page();
        //document.body.write(render());
        //jQuery.ready();
    })
});

function walk(node, func) {
    var children = node.childNodes;

    for (var i = 0; i < children.length; i++) {
        walk(children[i], func);
    }

    func(node);
}


function render_page() {
    var shipment_price = $('input[name=shipment_price]').val();
    $('input[name=total_price]').val(parseFloat(shipment_price) + parseFloat(product_extra.price));

    walk(document.body, function(element) {
        var e = $(element)
        var tagName = (e.prop('tagName') || '').toLowerCase()
        var price_names = ['price', 'old_price', 'price_w_vat', 'total_price_wo_shipping'];
        var denied_tags = ['form', 'option', 'select'];

        if (tagName === 'input') {
            if (price_names.indexOf(e.attr('name')) > -1) {
                e.val(product_extra.price);
            }
        }

        if (e.text().indexOf('{{') > -1 && e.text().indexOf('}}') > -1 && element.childNodes.length < 2
&& denied_tags.indexOf(tagName) < 0 || tagName === 'select') {
            var template = e.html() || e.text();
            var render = jinja.compile(template, {runtime: true}).render;
            e.html(render(product_extra));
        }

        if (e.val() && typeof e.val() === 'string' && e.val().indexOf('{{') > -1 && e.val().indexOf('}}') > -1) {
            var template = e.val()
            var render = jinja.compile(template, {runtime: true}).render;
            e.val(render(product_extra));
        }

        if (e.attr('src') && e.attr('src').indexOf('{{') > -1 && e.attr('src').indexOf('}}') > -1 && e.attr('src').indexOf('thumb') === -1) {
            var template = e.attr('src')
            var render = jinja.compile(template, {runtime: true}).render;
            e.attr('src', render(product_extra));
            try {
              e.parent().load();
            } catch(e) {
              //console.error(e);
            }

        }


        if (e.attr('class') && e.attr('class').indexOf('b-thumbs') > -1 && e.text().indexOf('{%') > -1 && e.text().indexOf('%}') > -1) {
          var template = e.html();
          var render = jinja.compile(template, {runtime: true}).render;
          e.html(render(product_extra));
        }
    });

    $('input[name=esub]').closest('form').submit(function(e) {
      	e.preventDefault();
      	$(this).closest('.js_submit').prop('disabled', true);

        FoxyAPI.createOrder();
    })

    $('.js_submit').on('click', function(e) {
      e.preventDefault();
      $(this).closest('form').submit()
    });
}

