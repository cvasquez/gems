console.clear();

/**
https://adventurezone.libsyn.com/rss
http://powertimepodcast.com/feed/podcast
http://askmeaboutemailmarketing.libsyn.com/rss
http://powertimepodcast.com
**/

// axi(rss);
var url,
    episodes = { items: [] },
    timeout,
    loadingMsg = '<span class="anim-magical">Making something magical.</span>',
    noPodcastMsg = 'Umm... that doesn\'t seem like a podcast rss link.';

function getRSS(btn) {
  $('#gemHtml').hide();
  $('#loader').html(loadingMsg);
  // Reset UI
  $('#gem').empty();
  $('#episodes').empty();
  episodes = { items: [] };

  if($('#loader').is(':hidden')) {
    $('#loader').css('opacity', 0).slideDown(250).animate(
      { opacity: 1 },
      { queue: false, duration: 250 }
    );
    $('#gem').html('<h2 class="text-center">' + loadingMsg + '</h2>');
    $('#logo').addClass('anim-hover');
  }
  url = $(btn).parents('.input-group').find('input[type="url"]').val();
  // axi(url);
  jsonGet(url);
}

function jsonGet(url) {

  // var episodesYQL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D%22' + encodeURIComponent(url) + '%22%20and%20output%3D%22atom_1.0%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

  var episodesYQL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22' + encodeURIComponent(url) + '%22&format=json&callback=';

  setTimeout(function(){
    $('#step1').fadeOut(200, function(){
      $('#loader').hide();
      $('#logo').removeClass('anim-hover');
      $('#step2').show();
      fadeInFlex('nav');

      $.getJSON(episodesYQL,
      function(data){
        // var title = data.query.results.feed.title,
        //     titleTrunc = title.substring(0,40) + (title.length > 40 ? '...' : ''),
        //     image = data.query.results.feed.image.href;

        $.each(data.query.results.item, function(i, item){
          // var epTitle = item.title[1] ? item.title[0] : item.title,
          var epTitle = Array.isArray(item.title) ? item.title[0] : item.title,
              epTitleTrunc = epTitle.substring(0,40) + (epTitle.length > 40 ? '...' : ''),
              epLink = item.link[0].href,
              epImage = item.image.href,
              epPubdate = item.pubDate,
              // epDuration = (item.duration.length < 6 ? '00:' + item.duration : item.duration),
              epDuration = item.duration,
              epDescription = item.description;

          episodes.items.push({
            item: {
              // titleTrunc: titleTrunc,
              // author: author,
              epTitleTrunc: epTitleTrunc,
              epLink: epLink,
              epImage: epImage,
              epPubdate: epPubdate,
              epDuration: epDuration,
              epDescription: epDescription
            }
          });

          $('#episodes').append(`
            <tr onClick="buildEpisode(${i})">
            <td>${epTitle}</td>
            </tr>
            `);

          return i<5;
        });

        // Build episode for most recent item in the feed.
        buildEpisode(0);
        setTimeout(function(){
          $('#gemHtml').slideDown(300);
        }, 400);
      });
    });
  }, 1000);
}

function axi(url){
  axios.get('https://anyorigin.com/go?url=http://45.63.111.29?awq=' + url)
  .then(function(response){
    var jsonresp = $.parseJSON(response.request.response),
    category = jsonresp.category,
    type = jsonresp.type,
    title = jsonresp.title,
    titleTrunc = title.substring(0, 55) + (title.length > 55 ? '...' : ''),
    image = jsonresp.image,
    link = (jsonresp.link || url),
    author = jsonresp.author,
    summary = jsonresp.summary;

    if(type === 'podcast') {
      setTimeout(function(){
        $('#step1').fadeOut(200, function(){
          $('#loader').hide();
          $('#logo').removeClass('anim-hover');
          $('#step2').show();
          fadeInFlex('nav');

          $.each(jsonresp.items, function(i, episode){
            var epTitle = episode.item.title,
            epTitleTrunc = epTitle.substring(0,40) + (epTitle.length > 40 ? '...' : ''),
            epLink = episode.item.link,
            epImage = (episode.item.image || image),
            epPubdate = episode.item.pubDate,
            epDuration = (episode.item.duration.length < 6 ? '00:' + episode.item.duration : episode.item.duration),
            epDescription = episode.item.description;

            episodes.items.push({
              item: {
                titleTrunc: titleTrunc,
                author: author,
                epTitleTrunc: epTitleTrunc,
                epLink: epLink,
                epImage: epImage,
                epPubdate: epPubdate,
                epDuration: epDuration,
                epDescription: epDescription
              }
            });

            $('#episodes').append(`
              <tr onClick="buildEpisode(${i})">
              <td>${epTitle}</td>
              </tr>
              `);

              // Show the last 5 podcasts
              return i<4;
            });

          // Build episode for most recent item in the feed.
          buildEpisode(0);
          setTimeout(function(){
            $('#gemHtml').slideDown(300);
          }, 400);
        });
      }, 1000);
    }
    // error if not a podcast
    else {
      $('#logo').removeClass('anim-hover');
      $('#loader').html(noPodcastMsg);
    }
    }).catch(function(error){
      console.log(error);
    });
  }


  function buildEpisode(num){
    // Add selected state to first episode table row
    $('#episodes tr').removeClass('table-info');
    $('#episodes tr:nth-child(' + (num+1) + ')').addClass('table-info');

    var episode = episodes.items[num].item;

    var tmpltCtrl = `
    <div class="element__controls">
    <a>copy to clipboard</a>
    </div>
    `;

    var tmpltHtml = `
      <center>
      <a href="${episode.epLink}" target="_blank" class="gem" style="box-sizing: border-box; color: #698596 !important; clear: both; display: inline-block; font-size: 16px !important; font-family: helvetica, arial, sans-serif !important; line-height: 1; text-decoration: none !important;">
        <!--[if !mso]><!-->
        <table bgcolor="#EEF0F2" border="0" cellspacing="0" cellpadding="0" width="100%" style="max-width: 540px;">
          <!--<![endif]--><!--[if (gte mso 9)|(IE)]><table cellspacing="0" cellpadding="0" width="540" style="font-family: Helvetica, Arial, sans-serif; "><![endif]-->
          <tbody>
            <tr>
              <td width="19%" style="vertical-align: top;" valign="top">
                <table border="0" cellspacing="0" cellpadding="0" width="100%">
                  <tbody>
                    <tr>
                      <td class="gem__image" style="vertical-align: text-top; display: block; max-height: 100px; height: auto; width: 100px;" valign="text-top">
                        <img src="${episode.epImage}" alt="Episode Thumbnail" height="100" width="100" style="max-width: 100%; height: auto;">
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style="vertical-align: top;" valign="top">
                <table cellspacing="0" cellpadding="0" width="100%">
                  <tbody>
                    <tr>
                      <td class="gem__meta" style="box-sizing: border-box; color: #546A78; min-height: 100px; padding: 24px 15px;">
                        <table cellspacing="0" cellpadding="0" width="100%">
                          <tbody>
                            <tr>
                              <td class="gem__title" style="font-family: helvetica, arial, sans-serif !imporant; font-weight: 700 !imporant; text-align: left !imporant;">
                                ${episode.epTitleTrunc}
                              </td>
                            </tr>
                            <!--<tr>
                              <td class="gem__author" style="color: #698596 !imporant; font-size: 14px !imporant; font-family: helvetica, arial, sans-serif !imporant; line-height: 1.6 !imporant; text-align: left !imporant;">
                                ${episode.titleTrunc}
                              </td>
                            </tr>-->
                            <tr>
                              <td class="gem__playbar" style="padding-top: 8px;">
                                <table cellspacing="0" cellpadding="0" width="100%">
                                  <tbody>
                                    <tr>
                                      <td class="gem__playBtn" width="6%" style="color: #698596 !imporant; font-size: 16px !imporant; font-family: helvetica, arial, sans-serif !imporant; line-height: 1.6 !imporant; padding-right: 5px !imporant; text-align: right !imporant;" align="right">
                                        &#9658;
                                      </td>
                                      <td class="gem__timeline" style="vertical-align: top;" width="69%" valign="top">
                                        <div style="border-bottom-style: solid; border-bottom-color: #698596 !imporant; border-bottom-width: 2px !imporant; height: 13px !imporant; width: 100% !imporant; margin: 5px !important;"></div>
                                      </td>
                                      <td class="gem__duration" width="24%" style="color: #698596 !imporant; font-size: 14px !imporant; font-family: helvetica, arial, sans-serif !imporant; line-height: 1.6 !imporant; font-weight: 700 !imporant; padding-left: 5px !imporant;">
                                        ${episode.epDuration}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </a>
      </center>
    `;

    $('#gem').html(tmpltHtml);

    var gemHTML = $('#gem').html();
    $('#gemHtml').val($.trim(gemHTML));
  }


// Fade-in for flexbox elements
function fadeInFlex(elem){
  if($(elem).css('display') === 'none'){
    $(elem).css({
      display: 'flex',
      opacity: 0
    }).animate(
      { opacity: 1 },
      { queue: false, duration: 250 }
    );
    return;
  };
}
