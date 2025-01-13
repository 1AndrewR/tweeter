/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  // Event listener for form submission
  $('form').on('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Serialize the form data
    const serializedData = $(this).serialize();

    // Send the serialized data to the server using AJAX
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: serializedData,
      success: function(response) {
        // Clear the form textarea
        $('#tweet-text').val('');

        // Fetch the latest tweets and render them
        loadTweets();
      },
      error: function(error) {
        console.error('Error submitting tweet:', error);
      }
    });
  });

  // Function to fetch and render tweets
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      success: function(tweets) {
        renderTweets(tweets);
      },
      error: function(error) {
        console.error('Error fetching tweets:', error);
      }
    });
  };

  // Initial load of tweets
  loadTweets();
});

const createTweetElement = function(tweet) {
  const $tweet = $(`
    <article class="tweet">
      <header>
        <img src="${tweet.user.avatars}" alt="Profile Picture">
        <div>
          <h2>${tweet.user.name}</h2>
          <p>${tweet.user.handle}</p>
        </div>
      </header>
      <p class="tweet-content">${tweet.content.text}</p>
      <footer>
        <div class="tweet-icons">
          <i class="fa fa-reply"></i>
          <i class="fa fa-retweet"></i>
          <i class="fa fa-heart"></i>
        </div>
        <p class="tweet-time">${timeago.format(tweet.created_at)}</p>
      </footer>
    </article>
  `);
  return $tweet;
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
