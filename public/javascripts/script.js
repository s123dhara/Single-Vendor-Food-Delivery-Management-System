
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


// document.addEventListener('DOMContentLoaded', function() {
//     var messageDiv = document.querySelector('.message');
//     if (messageDiv) {
//       messageDiv.style.display = 'block'; // Show the message div
//       setTimeout(function() {
//         messageDiv.style.display = 'none'; // Hide the message div after 5 seconds
//       }, 5000);
//     }
//     else{
//         messageDiv.style.display = 'none'
//     }
//   });


document.addEventListener("DOMContentLoaded", function() {
    showMessage2();
    
});
document.addEventListener('DOMContentLoaded', function() {

    showMessage();
});




function showMessage2() {
    const messageBox = document.getElementById("messageBox")
    
    if (messageBox) {
        // Show the message box with slide-in animation
        messageBox.classList.add('show');
        messageBox.classList.remove('hide');
        messageBox.style.display = 'block';

        // Hide the message box after 5 seconds with slide-out animation
        setTimeout(function() {
            messageBox.classList.add('hide');
            messageBox.classList.remove('show');

            // Set display to none after the slide-out animation ends (0.5s)
            setTimeout(function() {
                messageBox.style.display = 'none';
            }, 500);
        }, 5000);
    }
}

function showMessage(){
    const messageBox = document.querySelector('.product-upadate-message')

    if(messageBox){
        setTimeout(function(){
            messageBox.style.display = 'none'
        }, 1000);
    }
}



