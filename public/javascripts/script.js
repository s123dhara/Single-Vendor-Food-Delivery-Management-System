
// function showProfileCard() {
//     var userProfileCard = document.getElementById('userProfileCard');
//     if (userProfileCard.style.display === 'block') {
//         userProfileCard.style.display = 'none';
//     } else {
//         userProfileCard.style.display = 'block';
// }
// }


document.addEventListener('DOMContentLoaded', function() {
    var logoDiv = document.getElementById('profileLogoDiv');
    var userProfileCard = document.getElementById('userProfileCard');

    var showProfileCard = function() {
        userProfileCard.classList.remove('slide-out');
        userProfileCard.classList.add('slide-in');
        userProfileCard.style.display = 'block';
    };

    var hideProfileCard = function() {
        userProfileCard.classList.remove('slide-in');
        userProfileCard.classList.add('slide-out');
        // setTimeout(function() {
        //     userProfileCard.style.display = 'none';
        // }, 300); // Match the duration of the slideOut animation
    };

    logoDiv.addEventListener('mouseenter', showProfileCard);
    userProfileCard.addEventListener('mouseenter', showProfileCard);

    logoDiv.addEventListener('mouseleave', function() {
        setTimeout(function() {
            if (!userProfileCard.matches(':hover')) {
                hideProfileCard();
            }
        }, 300); // Add a slight delay to allow hover on userProfileCard
    });

    userProfileCard.addEventListener('mouseleave', hideProfileCard);
});


// function showMessage() {
//     var messageDiv = document.querySelector('.message');
//     messageDiv.style.display = 'block'; // Show the message div

//     setTimeout(function() {
//       messageDiv.style.display = 'none'; // Hide the message div after 5 seconds
//     }, 5000);
// }