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
timeout;

function getRSS(){
  if($('#loader').is(':visible')) {
    $('#loader').slideUp(250);
  } else {
    $('#loader').css('opacity', 0).slideDown(250).animate(
      { opacity: 1 },
      { queue: false, duariont: 250 }
    );
  }
  url = $('#url').val();
  axi(url);
}

function axi(url){
  // Reset UI
  $('#gem').empty();
  $('#episodes').empty();
  episodes = { items: [] };

  axios.get('https://crossorigin.me/http://45.63.111.29?awq=' + url)
  .then(function(response){
    setTimeout(function(){
      $('#step1').fadeOut(200, function(){
        $('#loader').hide();
        // episode.item.title.substring(0,45) + (episode.item.title.length > 45 ? '...' : '')
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
          console.log('Podcast!');
        } else {
          console.log('Not a podcast.');
        }

        // $('#gem').html(`
        //   <div class="podcast">
        //     <img class="podcast__image" src="${image}" alt="${title}" style="max-width: 200px; height: auto;" />
        //     <div class="podcast__title"><a href="${link}"> ${title}</a></div>
        //     <div class="podcast__author">By ${author}</div>
        //     <div class="podcast__summary">${summary}</div>
        //   </div>
        // `);

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
            <td>${epPubdate}</td>
            </tr>
            `);

            // Show the last 5 podcasts
            return i<4;
          });

        buildEpisode(0);
      });
    }, 1000);
    }).catch(function(error){
      console.log(error);
    });
  }


  function buildEpisode(num){
    var episode = episodes.items[num].item;

    var tmpltCtrl = `
    <div class="element__controls">
    <a>copy to clipboard</a>
    </div>
    `;

    var tmpltHtml = `
    <a href="${episode.epLink}" class="gem">
    <!--[if !mso]><!-->
    <table bgcolor="#EEF0F2" border="0" cellspacing="0" cellpadding="0" width="100%" style="max-width: 540px; ">
    <!--<![endif]-->
    <!--[if (gte mso 9)|(IE)]><table cellspacing="0" cellpadding="0" width="540" style="font-family: Helvetica, Arial, sans-serif; "><![endif]-->
    <tr>
    <td width="19%" style="vertical-align: top">
    <table border="0" cellspacing="0" cellpadding="0" width="100%">
    <tr>
    <td class="gem__image" style="vertical-align: text-top">
    <img src="${episode.epImage}" alt="${episode.epTitle}" height="100" width="100" style="max-width: 100%; height: auto;">
    </td>
    </tr>
    </table>
    </td>
    <td width="81%" style="vertical-align: top;">
    <table cellspacing="0" cellpadding="0" width="100%">
    <tr>
    <td class="gem__meta">
    <table cellspacing="0" cellpadding="0" width="100%">
    <tr>
    <td class="gem__title">
    ${episode.epTitleTrunc}
    </td>
    </tr>
    <tr>
    <td class="gem__author">${episode.titleTrunc}</td>
    </tr>
    <tr>
    <td class="gem__playbar">
    <table cellspacing="0" cellpadding="0" width="100%">
    <tr>
    <td class="gem__playBtn" width="6%">
    ►
    </td>
    <td class="gem__timeline" style="vertical-align:top;" width="69%">
    <div></div>
    </td>
    <td class="gem__duration" width="24%">
    ${episode.epDuration}
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </a>
    ${tmpltCtrl}
    `;

    $('#gem').html(tmpltHtml);
  }
