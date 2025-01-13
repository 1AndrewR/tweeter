/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  // Event listener for form submission
  $('form').on('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the tweet content
    const tweetContent = $('#tweet-text').val().trim();

    // Validate the tweet content
    if (!isValidTweet(tweetContent)) {
      return;
    }

    // Serialize the form data
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

      // Fetch the latest tweet and prepend it to the tweets container
      $.ajax({
        url: '/tweets',
        method: 'GET'
      })
      .done(function(tweets) {
        const latestTweet = tweets[tweets.length - 1];
        const $tweet = createTweetElement(latestTweet);
        $('#tweets-container').prepend($tweet);
      })
      .fail(function(error) {
        console.error('Error fetching latest tweet:', error);
      });
    })
    .fail(function(error) {
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
      console.error('Error fetching tweets:', error);
    });
  };

  // Initial load of tweets
  loadTweets();
});

// Function to validate tweet content
const isValidTweet = function(tweetContent) {
  if (!tweetContent) {
    alert('Tweet content cannot be empty.');
    return false;
  }

  if (tweetContent.length > 140) {
    alert('Tweet content exceeds the 140 character limit.');
    return false;
  }

  return true;
};

const createTweetElement = function(tweet) {
  const $tweet = $('<article>').addClass('tweet');
  
  const $header = $('<header>');
  const $img = $('<img>').attr('src', tweet.user.avatars).attr('alt', 'Profile Picture');
  const $div = $('<div>');
  const $h2 = $('<h2>').text(tweet.user.name);
  const $pHandle = $('<p>').text(tweet.user.handle);
  
  $div.append($h2, $pHandle);
  $header.append($img, $div);
  
  const $content = $('<p>').addClass('tweet-content').text(tweet.content.text);
  
  const $footer = $('<footer>');
  const $icons = $('<div>').addClass('tweet-icons');
  const $replyIcon = $('<i>').addClass('fa fa-reply');
  const $retweetIcon = $('<i>').addClass('fa fa-retweet');
  const $heartIcon = $('<i>').addClass('fa fa-heart');
  
  $icons.append($replyIcon, $retweetIcon, $heartIcon);
  const $time = $('<p>').addClass('tweet-time').text(timeago.format(tweet.created_at));
  
  $footer.append($icons, $time);
  
  $tweet.append($header, $content, $footer);
  
  return $tweet;
};

const renderTweets = function(tweets) {
  // Empty the tweets container before rendering new tweets
  $('#tweets-container').empty();

  // Check if the tweets array is not empty
  if (tweets.length > 0) {
    // Loop through tweets and prepend each one to the tweets container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
  } else {
    console.log('No tweets to display.');
  }
};
