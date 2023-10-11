{
  /* <script> */
}
document.addEventListener("DOMContentLoaded", function () {
  const problems = JSON.parse(localStorage.getItem("exercise_problems")) || [];
  let currentProblemIndex = 0;
  let startTime = 0;
  let timerInterval;
  const userAnswers = [];
  const questionTimes = [];

  const problemContainer = document.getElementById("problem-container");
  const problemText = document.getElementById("problem-text");
  const userAnswerInput = document.getElementById("user-answer");
  const nextButton = document.getElementById("next-button");
  const questionNumber = document.getElementById("question-number");
  const timerElement = document.getElementById("timer");
  const cancelButton = document.getElementById("cancel-button");

  // Disable input suggestions
  userAnswerInput.setAttribute("autocomplete", "off");

  // Focus on the input element when the page loads
  userAnswerInput.focus();

  userAnswerInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default Enter key behavior (e.g., submitting forms)

      // Trigger the click event on the "Next" button
      nextButton.click();
    }
  });

  function displayProblem() {
    if (currentProblemIndex < problems.length) {
      const problem = problems[currentProblemIndex];
      questionNumber.textContent = `${currentProblemIndex + 1}/${
        problems.length
      }`; // Update question number

      // Preprocess the problem text to replace * with \cdot and / with \div
      const processedProblemText = preprocessQuestion(problem[0]);

      // Render and display the math problem using KaTeX
      const problemText = document.getElementById("problem-text");
      problemText.innerHTML = katex.renderToString(processedProblemText);

      // Update the progress bar
      updateProgressBar();

      startTimer(); // Start or resume timer for this question
    } else {
      problemText.textContent = "No more problems."; // Display a message when there are no more problems
      userAnswerInput.disabled = true;
      nextButton.disabled = true;
      clearInterval(timerInterval);
      evaluateAndDisplayResults();
    }
  }

  function preprocessQuestion(question) {
    // Replace * with \cdot and / with \div
    return question.replace(/\*/g, "\\times").replace(/\//g, "\\div");
  }

  function startTimer() {
    startTime = new Date().getTime();
    clearInterval(timerInterval); // Clear any previous interval
    timerInterval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const formattedTime = formatTime(elapsedTime);
    timerElement.textContent = formattedTime;
  }

  function formatTime(milliseconds, format = "default") {
    if (isNaN(milliseconds)) {
      return "0 seconds"; // Return '0s' for NaN values
    }

    if (format === "results") {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      if (minutes === 0) {
        return `${remainingSeconds} seconds`;
      } else {
        return `${minutes}m  ${remainingSeconds}s`;
      }
    } else {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
  }

  const progressBar = document.getElementById("progress-bar");

  function updateProgressBar() {
    const numberOfQuestions = problems.length;
    const progressBar = document.getElementById("progress-bar");

    // Clear existing segments
    progressBar.innerHTML = "";

    for (let i = 0; i < numberOfQuestions; i++) {
      const segment = document.createElement("div");
      segment.classList.add("progress-segment");

      // Check the question status and update the class accordingly
      if (i < currentProblemIndex) {
        segment.classList.add("answered"); // Question has been answered
      } else if (i === currentProblemIndex) {
        segment.classList.add("current"); // Current question
      }

      progressBar.appendChild(segment);
    }
  }

  displayProblem(); // Initial display

  nextButton.addEventListener("click", function () {
    // Check the user's answer and handle it as needed
    if (currentProblemIndex < problems.length) {
      const problem = problems[currentProblemIndex];
      const userAnswer = parseFloat(userAnswerInput.value);

      // Compare user's answer to the correct answer (problem[1])
      // You can add your validation logic here

      // Store the user's answer
      userAnswers.push(userAnswer);
      questionTimes.push(getElapsedTime()); // Store the time taken for this question

      // Move to the next problem
      currentProblemIndex++;
      userAnswerInput.value = ""; // Clear the user's answer
      displayProblem(); // Display the next problem
    }
  });

  cancelButton.addEventListener("click", function () {
    // Evaluate the results of the answered questions and leave the rest as incorrect
    evaluateAndDisplayResults(true); // Pass true to indicate cancellation
  });

  function evaluateAndDisplayResults(isCancellation) {
    // You can evaluate the results here based on userAnswers, problems, and questionTimes
    const results = [];
    let totalElapsedTime = 0; // Total time for the entire exercise

    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      const userAnswer = userAnswers[i];
      const correctAnswer = problem[1];
      const isCorrect = userAnswer === correctAnswer;
      const elapsedTime = questionTimes[i];
      totalElapsedTime += elapsedTime;

      // If it's a cancellation and the question is unanswered, mark it as incorrect
      if (isCancellation && userAnswer === null) {
        isCorrect = false;
      }

      results.push({
        questionNumber: i + 1,
        problemText: problem[0],
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        elapsedTime: formatTime(elapsedTime, "results"), // Format elapsed time for this question
      });
    }

    // Display the results on a new page or modal dialog
    displayResults(results, formatTime(totalElapsedTime, "results")); // Pass the totalElapsedTime
  }

  function getElapsedTime() {
    const currentTime = new Date().getTime();
    return currentTime - startTime;
  }

  //   function displayResults(results, totalElapsedTime) {
  //     // Calculate the number of questions answered incorrectly
  //     const incorrectCount = results.filter((result) => !result.isCorrect).length;

  //     // You can customize how you want to display the results
  //     const resultsContainer = document.createElement("div");
  //     resultsContainer.classList.add("result-container");

  //     // Display total elapsed time for the entire exercise and the number of questions answered incorrectly
  //     resultsContainer.innerHTML = `
  //                     <h1>Results</h1>
  //                     <p>Total Time Spent: ${totalElapsedTime}</p>
  //                     <p>Incorrect Answers: ${incorrectCount}</p>
  //                 `;

  //     // Display each result item
  //     results.forEach((result, index) => {
  //       const resultDiv = document.createElement("div");
  //       resultDiv.classList.add("result");
  //       const resultTextDiv = document.createElement("div");
  //       resultTextDiv.classList.add("result-text");

  //       // Set the background color based on the result
  //       if (result.isCorrect) {
  //         resultTextDiv.style.color = "#000"; // Green text for correct
  //       } else {
  //         resultTextDiv.style.color = "#d40f0f"; // Red text for incorrect
  //       }

  //       // Create elements for the problem, user answer, equality sign, and correct answer
  //       const problemElement = document.createElement("div");
  //       const equalityElement = document.createElement("div");
  //       const correctAnswerElement = document.createElement("div");

  //       // Render LaTeX math using KaTeX and set the font size
  //       const processedProblemText = preprocessQuestion(result.problemText);

  //       // Combine the LaTeX math with additional information
  //       if (result.isCorrect) {
  //         problemElement.innerHTML = katex.renderToString(
  //           processedProblemText + "=" + result.userAnswer,
  //           { throwOnError: false }
  //         );
  //       } else {
  //         problemElement.innerHTML = katex.renderToString(
  //           processedProblemText + " \\neq " + result.userAnswer,
  //           { throwOnError: false }
  //         );
  //         correctAnswerElement.textContent =
  //           "correct answer: " + result.correctAnswer;
  //       }

  //       // Display "Question 1" instead of the number
  //       const questionLabel = document.createElement("div");
  //       questionLabel.classList.add("question-label");
  //       questionLabel.textContent = "Question " + (index + 1);

  //       resultTextDiv.appendChild(questionLabel);
  //       resultTextDiv.appendChild(problemElement);
  //       resultTextDiv.appendChild(equalityElement);
  //       resultTextDiv.appendChild(correctAnswerElement);

  //       // Add time taken information
  //       const timeTakenElement = document.createElement("div");
  //       timeTakenElement.textContent = `time taken: ${result.elapsedTime}`;

  //       resultTextDiv.appendChild(timeTakenElement);

  //       resultDiv.appendChild(resultTextDiv);
  //       resultsContainer.appendChild(resultDiv);
  //     });

  //     // Add "Save" and "Back" buttons
  //     const saveButton = document.createElement("button");
  //     saveButton.textContent = "Save";
  //     saveButton.classList.add("button", "save-button");
  //     saveButton.addEventListener("click", function () {
  //       // Prepare the data to send to the backend
  //       const resultsData = {
  //         results: results, // An array containing result objects
  //         totalElapsedTime: totalElapsedTime, // Total time taken for the entire exercise
  //       };

  //       // Send a POST request to the backend to save the results
  //       fetch("/save_results", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(resultsData),
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           // Handle the response from the backend, if needed
  //           console.log(data);
  //         })
  //         .catch((error) => {
  //           console.error("Error saving results:", error);
  //         });
  //     });

  //     const backButton = document.createElement("button");
  //     backButton.textContent = "Back to Home";
  //     backButton.classList.add("button", "back-button");
  //     backButton.addEventListener("click", function () {
  //       window.location.href = "/";
  //     });

  //     // Append buttons to the resultsContainer
  //     resultsContainer.appendChild(saveButton);
  //     resultsContainer.appendChild(backButton);

  //     // Replace the contents of the document body with the resultsContainer
  //     document.body.innerHTML = "";
  //     document.body.appendChild(resultsContainer);
  //   }

  function displayResults(results, totalElapsedTime) {
    // Calculate the number of questions answered incorrectly
    const incorrectCount = results.filter((result) => !result.isCorrect).length;

    // Create a results container using Tailwind CSS classes
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add(
      "bg-white",
      "p-4", // Reduced padding on small screens
      "rounded-lg",
      "shadow-md",
      "w-full",
      "mx-auto",
      "my-4", // Reduced margin on small screens
      "sm:p-8", // Increase padding on small screens and larger
      "sm:my-8" // Increase margin on small screens and larger
    );

    // Create a header for the results
    const header = document.createElement("h1");
    header.classList.add(
      "text-2xl",
      "text-center",
      "font-semibold",
      "mb-2",
      "sm:text-3xl",
      "sm:mb-4"
    );
    header.textContent = "Results";

    // Create a div for total time spent
    const totalTimeDiv = document.createElement("p");
    totalTimeDiv.classList.add(
      "mb-2",
      "flex",
      "flex-row",
      "items-center",
      "justify-center",
      "text-green-500",
      "sm:mb-4"
    );
    totalTimeDiv.textContent = `Total Time Spent: ${totalElapsedTime}`;

    // Create a div for the number of incorrect answers
    const incorrectCountDiv = document.createElement("p");
    incorrectCountDiv.classList.add(
      "mb-2",
      "flex",
      "flex-row",
      "items-center",
      "justify-center",
      "text-red-500",
      "sm:mb-4"
    );
    incorrectCountDiv.textContent = `Incorrect Answers: ${incorrectCount}`;

    // Create a table for displaying individual results
    const resultsTable = document.createElement("table");
    resultsTable.classList.add("table-auto", "w-full", "mb-2", "sm:mb-4");

    // Create table header row
    const tableHeadRow = document.createElement("tr");
    const headers = ["Problem", "Your Answer", "Correct Answer", "Result"];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.classList.add("py-2", "px-2", "sm:px-4"); // Reduced padding on small screens
      th.textContent = headerText;
      tableHeadRow.appendChild(th);
    });

    resultsTable.appendChild(tableHeadRow);

    // Create a table body for result rows
    const tableBody = document.createElement("tbody");

    // Iterate through each result
    results.forEach((result, index) => {
      const tr = document.createElement("tr");
      tr.classList.add(index % 2 === 0 ? "bg-gray-100" : "bg-white");

      // Create table data cells for each result field
      const fields = [
        result.problemText,
        result.userAnswer, // Display user's answer
        result.correctAnswer,
        result.isCorrect ? "Correct" : "Incorrect",
      ];
      fields.forEach((fieldText) => {
        const td = document.createElement("td");
        td.classList.add("py-2", "px-2", "sm:px-4"); // Reduced padding on small screens
        td.textContent = fieldText;
        tr.appendChild(td);
      });

      tableBody.appendChild(tr);
    });

    resultsTable.appendChild(tableBody);

    // Create "Save" and "Back" buttons
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add(
      "bg-indigo-500",
      "text-white",
      "py-2",
      "px-2", // Reduced padding on small screens
      "rounded-md",
      "hover:bg-indigo-600",
      "focus:outline-none",
      "focus:ring",
      "focus:ring-indigo-200",
      "focus:ring-opacity-50",
      "mr-2"
    );
    saveButton.addEventListener("click", function () {
      // Prepare the data to send to the backend
      const resultsData = {
        results: results, // An array containing result objects
        totalElapsedTime: totalElapsedTime, // Total time taken for the entire exercise
      };

      // Send a POST request to the backend to save the results
      fetch("/save_results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultsData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the backend, if needed
          console.log(data);
        })
        .catch((error) => {
          console.error("Error saving results:", error);
        });
    });

    const backButton = document.createElement("button");
    backButton.textContent = "Back to Home";
    backButton.classList.add(
      "bg-gray-500",
      "text-white",
      "py-2",
      "px-2", // Reduced padding on small screens
      "rounded-md",
      "hover:bg-gray-600",
      "focus:outline-none",
      "focus:ring",
      "focus:ring-gray-200",
      "focus:ring-opacity-50"
    );
    backButton.addEventListener("click", function () {
      window.location.href = "/";
    });

    const buttonDiv = document.createElement("div");
    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(backButton);
    buttonDiv.classList.add("flex", "items-center", "justify-center");

    // Append all elements to the results container
    resultsContainer.appendChild(header);
    resultsContainer.appendChild(totalTimeDiv);
    resultsContainer.appendChild(incorrectCountDiv);
    resultsContainer.appendChild(resultsTable);
    resultsContainer.appendChild(buttonDiv);
    // resultsContainer.appendChild(backButton);

    // Replace the contents of the document body with the resultsContainer
    document.body.innerHTML = "";
    document.body.appendChild(resultsContainer);
  }
});
{
  /* </script> */
}
