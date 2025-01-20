$(document).ready(function() {
  $('form').on('submit', function(event) {
    event.preventDefault();

    $('#error-message').slideUp();

    const tweetContent = $('#tweet-text').val().trim();

    if (!isValidTweet(tweetContent)) {
      return;
    }

    const serializedData = $(this).serialize();

    // Send the serialized data to the server using AJAX
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: serializedData
    })
    .done(function(response) {
      // Clear the form textarea
      $('#tweet-text').val('');

      // Reset the character counter
      $('.counter').text(140);

      loadTweets();
    })
    .fail(function(error) {
      $('#error-message').text('Error submitting tweet. Please try again.').slideDown();
      console.error('Error submitting tweet:', error);
    });
  });

  // Function to fetch and render tweets
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET'
    })
    .done(function(tweets) {
      renderTweets(tweets);
    })
    .fail(function(error) {
      $('#error-message').text('Error fetching tweets. Please try again.').slideDown();
      console.error('Error fetching tweets:', error);
    });
  };

  loadTweets();
});

const isValidTweet = function(tweetContent) {
  if (!tweetContent) {
    $('#error-message').text('Tweet content cannot be empty.').slideDown();
    return false;
  }

  if (tweetContent.length > 140) {
    $('#error-message').text('Tweet content exceeds the 140 character limit.').slideDown();
    return false;
  }

  return true;
};

const createTweetElement = function(tweet) {
  const html = `
    <article class="tweet">
      <div class="tweet-header">
        <img src="${escape(tweet.user.avatars)}" alt="Profile Picture">
        <div class="tweet-user-info">
          <h2>${escape(tweet.user.name)}</h2>
        </div>
        <p class="tweet-handle">${escape(tweet.user.handle)}</p>
      </div>
      <p class="tweet-content">${escape(tweet.content.text)}</p>
      <footer class="tweet-footer">
        <p class="tweet-time">${timeago.format(tweet.created_at)}</p>
        <div class="tweet-icons">
          <i class="fa fa-reply"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
      </footer>
    </article>
  `;
  return $(html);
};

const renderTweets = function(tweets) {
  // Empty the tweets container before rendering new tweets
  $('#tweets-container').empty();

  // Loop through tweets and prepend each one to the tweets container
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
};

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
