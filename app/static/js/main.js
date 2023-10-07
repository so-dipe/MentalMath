// // main.js

// document.addEventListener('DOMContentLoaded', function () {
//     // Get a reference to the "Start" button
//     const startButton = document.getElementById('startButton');

//     // Add a click event listener to the "Start" button
//     startButton.addEventListener('click', function () {
//         // Make an AJAX request to the '/start' endpoint to start the exercise
//         fetch('/start', {
//             method: 'POST',
//         })
//         .then(response => response.json())
//         .then(data => {
//             // Handle the response from the server (e.g., you can display a message or redirect to the exercise page)
//             console.log(data); // You can remove or modify this as needed
//             window.location.href = '/exercise/1'; // Redirect to the first exercise page
//         })
//         // .catch(error => {
//         //     console.error('Error starting exercise:', error);
//         // });
//     });
// });

