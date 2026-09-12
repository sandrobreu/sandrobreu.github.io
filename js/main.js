/*
* Template Name: BreezyCV - Resume / CV / vCard / Portfolio Template
* Author: LMPixels
* Author URL: http://themeforest.net/user/lmpixels
* Version: 1.5.0
*/

(function($) {
"use strict";
    // Portfolio subpage filters
    function portfolio_init() {
        var portfolio_grid = $('.portfolio-grid'),
            portfolio_filter = $('.portfolio-filters');
            
        if (portfolio_grid) {

            portfolio_grid.shuffle({
                speed: 450,
                itemSelector: 'figure'
            });

            portfolio_filter.on("click", ".filter", function (e) {
                portfolio_grid.shuffle('update');
                e.preventDefault();
                $('.portfolio-filters .filter').parent().removeClass('active');
                $(this).parent().addClass('active');
                portfolio_grid.shuffle('shuffle', $(this).attr('data-group') );
            });

        }
    }
    // /Portfolio subpage filters


    // Hide Mobile menu
    function mobileMenuHide() {
        var windowWidth = $(window).width(),
            siteHeader = $('#site_header');

        if (windowWidth < 1025) {
            siteHeader.addClass('mobile-menu-hide');
            $('.menu-toggle').removeClass('open');
            setTimeout(function(){
                siteHeader.addClass('animate');
            }, 500);
        } else {
            siteHeader.removeClass('animate');
        }
    }
    // /Hide Mobile menu

    // Custom scroll
    function customScroll() {
        var windowWidth = $(window).width();
        if (windowWidth > 1024) {
            $('.animated-section, .single-page-content').each(function() {
                $(this).perfectScrollbar();
            });
        } else {
            $('.animated-section, .single-page-content').each(function() {
                $(this).perfectScrollbar('destroy');
            });
        }
    }
    // /Custom scroll

    // Contact form validator
    $(function () {

        $('#contact_form').validator();

        $('#contact_form').on('submit', function (e) {
            if (!e.isDefaultPrevented()) {
                var url = "contact_form/contact_form.php";

                $.ajax({
                    type: "POST",
                    url: url,
                    data: $(this).serialize(),
                    success: function (data)
                    {
                        var messageAlert = 'alert-' + data.type;
                        var messageText = data.message;

                        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                        if (messageAlert && messageText) {
                            $('#contact_form').find('.messages').html(alertBox);
                            $('#contact_form')[0].reset();
                        }
                    }
                });
                return false;
            }
        });
    });
    // /Contact form validator

    //On Window load & Resize
    $(window)
        .on('load', function() { //Load
            // Animation on Page Loading
            $(".preloader").fadeOut( 800, "linear" );

            // initializing page transition.
            var ptPage = $('.animated-sections');
            if (ptPage[0]) {
                PageTransitions.init({
                    menu: 'ul.main-menu',
                });
            }
        })
        .on('resize', function() { //Resize
             mobileMenuHide();
             $('.animated-section').each(function() {
                $(this).perfectScrollbar('update');
            });
            customScroll();
        });


    // On Document Load
    $(document).ready(function () {
        // Portfolio profile updates
        $('.header-buttons').hide();

        var aboutParagraph = $('section[data-id="about-me"] .col-xs-12.col-sm-7 > p').first();
        if (aboutParagraph.length) {
            aboutParagraph.html('I am a Digital Transformation & Data Engineer with a strong background in finance, passionate about emerging technologies such as blockchain and artificial intelligence. In 2026, I completed the MAS in Data Science at ZHAW School of Engineering, strengthening my expertise in Data Science, MLOps, Deep Learning, Reinforcement Learning, and Large Language Models (LLMs).');
        }

        var experienceTimeline = $('section[data-id="resume"] .timeline.timeline-second-style.clearfix').eq(1);
        if (experienceTimeline.length) {
            var firstExperience = experienceTimeline.find('.timeline-item').first();
            firstExperience.find('.item-period').text('Jan 2020 – Aug 2026');

            if (!$('#unifinanz-experience').length) {
                experienceTimeline.prepend(`
                    <div id="unifinanz-experience" class="timeline-item clearfix">
                      <div class="left-part">
                        <h5 class="item-period">Sep 2026 – Present</h5>
                        <span class="item-company"><a href="https://www.unifinanz.li/de/" target="_blank">Unifinanz Trust reg.</a></span>
                        <span class="item-company">Schaan, Liechtenstein</span>
                      </div>
                      <div class="divider"></div>
                      <div class="right-part">
                        <h4 class="item-title">Digital Transformation & Data Engineer</h4>
                        <p>Working on digital transformation and data engineering initiatives, connecting business requirements with modern data, automation, and AI solutions.</p>
                      </div>
                    </div>
                `);
            }
        }

        // Weekly Bytes: keep the blog section data-driven and always show the six newest editions.
        var newsletterPage = 'https://www.linkedin.com/newsletters/7113976045355048961/';
        var $blogSection = $('section[data-id="blog"]');
        var $blogContainer = $blogSection.find('.blog-masonry');

        $blogSection.find('.page-title h2').html('Weekly <span>Bytes</span>');
        $blogSection.find('.col-xs-12.col-sm-12 > p').first().html('Die sechs neuesten Ausgaben meines LinkedIn-Newsletters <strong>Weekly Bytes</strong> – rund um Data, AI, Technology und eigene Projekte.');
        $blogSection.find('a.btn.btn-primary').attr('href', newsletterPage).text('Alle Weekly Bytes auf LinkedIn ansehen');

        $.getJSON('data/newsletter.json')
            .done(function(posts) {
                var latestPosts = posts
                    .filter(function(post) {
                        return post && post.title && post.published && post.url;
                    })
                    .sort(function(a, b) {
                        return new Date(b.published) - new Date(a.published);
                    })
                    .slice(0, 6);

                if (!latestPosts.length) {
                    return;
                }

                $blogContainer.empty();

                latestPosts.forEach(function(post, index) {
                    var date = new Date(post.published + 'T12:00:00');
                    var formattedDate = date.toLocaleDateString('de-CH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    var image = post.image || 'img/linkedin_2.png';
                    var safeTitle = $('<div>').text(post.title).html();
                    var safeUrl = $('<div>').text(post.url).html();
                    var safeImage = $('<div>').text(image).html();

                    $blogContainer.append(`
                        <div class="item post-${index + 1}">
                          <div class="blog-card">
                            <div class="media-block">
                              <div class="category"><a href="${newsletterPage}" target="_blank" rel="noopener noreferrer" title="LinkedIn Newsletter">Weekly Bytes</a></div>
                              <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">
                                <img src="${safeImage}" class="size-blog-masonry-image-two-c" alt="${safeTitle}" onerror="this.onerror=null;this.src='img/linkedin_2.png';" />
                                <div class="mask"></div>
                              </a>
                            </div>
                            <div class="post-info">
                              <span class="item-date">${formattedDate}</span>
                              <a href="${safeUrl}" target="_blank" rel="noopener noreferrer"><h4 class="blog-item-title">${safeTitle}</h4></a>
                            </div>
                          </div>
                        </div>
                    `);
                });

                $blogContainer.imagesLoaded(function() {
                    if ($blogContainer.data('masonry')) {
                        $blogContainer.masonry('reloadItems');
                        $blogContainer.masonry('layout');
                    } else {
                        $blogContainer.masonry();
                    }
                });
            });

        var movementStrength = 23;
        var height = movementStrength / $(document).height();
        var width = movementStrength / $(document).width();
        $("body").on('mousemove', function(e){
            var pageX = e.pageX - ($(document).width() / 2),
                pageY = e.pageY - ($(document).height() / 2),
                newvalueX = width * pageX * -1,
                newvalueY = height * pageY * -1,
                elements = $('.lm-animated-bg');

            elements.addClass('transition');
            elements.css({
                "background-position": "calc( 50% + " + newvalueX + "px ) calc( 50% + " + newvalueY + "px )",
            });

            setTimeout(function() {
                elements.removeClass('transition');
            }, 300);
        })

        // Mobile menu
        $('.menu-toggle').on("click", function () {
            $('#site_header').addClass('animate');
            $('#site_header').toggleClass('mobile-menu-hide');
            $('.menu-toggle').toggleClass('open');
        });

        // Mobile menu hide on main menu item click
        $('.main-menu').on("click", "a", function (e) {
            mobileMenuHide();
        });

        // Sidebar toggle
        $('.sidebar-toggle').on("click", function () {
            $('#blog-sidebar').toggleClass('open');
        });

        // Initialize Portfolio grid
        var $portfolio_container = $(".portfolio-grid");
        $portfolio_container.imagesLoaded(function () {
            portfolio_init(this);
        });

        // Blog grid init
        var $container = $(".blog-masonry");
        $container.imagesLoaded(function(){
            $container.masonry();
        });

        customScroll();

        // Text rotation
        $('.text-rotation').owlCarousel({
            loop: true,
            dots: false,
            nav: false,
            margin: 0,
            items: 1,
            autoplay: true,
            autoplayHoverPause: false,
            autoplayTimeout: 3800,
            animateOut: 'animated-section-scaleDown',
            animateIn: 'animated-section-scaleUp'
        });

        // Testimonials Slider
        $(".testimonials.owl-carousel").owlCarousel({
            nav: true, // Show next/prev buttons.
            items: 3, // The number of items you want to see on the screen.
            loop: false, // Infinity loop. Duplicate last and first items to get loop illusion.
            navText: false,
            autoHeight: true,
            margin: 25,
            responsive : {
                // breakpoint from 0 up
                0 : {
                    items: 1,
                },
                // breakpoint from 480 up
                480 : {
                    items: 1,
                },
                // breakpoint from 768 up
                768 : {
                    items: 2,
                },
                1200 : {
                    items: 2,
                }
            }
        });

        // Clients Slider
        $(".clients.owl-carousel").imagesLoaded().owlCarousel({
            nav: true, // Show next/prev buttons.
            items: 2, // The number of items you want to see on the screen.
            loop: false, // Infinity loop. Duplicate last and first items to get loop illusion.
            navText: false,
            margin: 10,
            autoHeight: true,
            responsive : {
                // breakpoint from 0 up
                0 : {
                    items: 2,
                },
                // breakpoint from 768 up
                768 : {
                    items: 4,
                },
                1200 : {
                    items: 5,
                }
            }
        });


        //Form Controls
        $('.form-control')
            .val('')
            .on("focusin", function(){
                $(this).parent('.form-group').addClass('form-group-focus');
            })
            .on("focusout", function(){
                if ($(this).val().length === 0) {
                    $(this).parent('.form-group').removeClass('form-group-focus');
                }
            });

        // Lightbox init
        $('body').magnificPopup({
            delegate: 'a.lightbox',
            type: 'image',
            removalDelay: 300,

            // Class that is added to popup wrapper and background
            // make it unique to apply your CSS animations to just this exact popup
            mainClass: 'mfp-fade',
            image: {
                // options for image content type
                titleSrc: 'title',
                gallery: {
                    enabled: true
                },
            },

            iframe: {
                markup: '<div class="mfp-iframe-scaler">'+
                        '<div class="mfp-close"></div>'+
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                        '<div class="mfp-title mfp-bottom-iframe-title"></div>'+
                      '</div>', // HTML markup of popup, `mfp-close` will be replaced by mfp-close button

                patterns: {
                    youtube: {
                      index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                      id: null, // String that splits URL in a two parts, second part should be %id%
                      // Or null - full URL will be returned
                      // Or a function that should return %id%, for example:
                      // id: function(url) { return 'parsed id';

                      src: '%id%?autoplay=1' // URL that will be set as a source for iframe.
                    },
                    vimeo: {
                      index: 'vimeo.com/',
                      id: '/',
                      src: '//player.vimeo.com/video/%id%?autoplay=1'
                    },
                    gmaps: {
                      index: '//maps.google.',
                      src: '%id%&output=embed'
                    }
                },

                srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
            },

            callbacks: {
                markupParse: function(template, values, item) {
                 values.title = item.el.attr('title');
                }
            },
        });

    });

})(jQuery);
