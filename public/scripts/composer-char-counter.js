$(document).ready(function() {
  console.log("composer-char-counter.js is loaded");

  // Select the textarea element inside the .new-tweet section
  const $textarea = $(".new-tweet textarea");

  // Register an event handler for the input event
  $textarea.on("input", function() {
    const maxLength = 140;
    const currentLength = $(this).val().length;
    const remainingChars = maxLength - currentLength;

    // Update the counter
    const $counter = $(this).closest("form").find(".counter");
    $counter.text(remainingChars);

    // Change the color of the counter if the character limit is exceeded
    if (remainingChars < 0) {
      $counter.addClass("over-limit");
    } else {
      $counter.removeClass("over-limit");
    }
  });
});
