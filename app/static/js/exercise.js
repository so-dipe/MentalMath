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

      const inputElement = document.getElementById("user-answer");

      // Set focus on the input element
      inputElement.focus();
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

    // Create a results container
    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "p-4",
      "rounded-lg",
      "shadow-md",
      "w-full",
      "mx-auto",
      "my-4",
      "sm:p-8",
      "sm:my-8"
    );

    // header for the results
    const header = document.createElement("h1");
    header.classList.add(
      "text-3xl",
      "font-semibold",
      "mb-4",
      "text-center",
      "text-indigo-600"
    );
    header.textContent = "Quiz Results";

    // div for total time spent
    const totalTimeDiv = document.createElement("p");
    totalTimeDiv.classList.add(
      "mb-4",
      "text-center",
      "text-xl",
      "text-gray-600"
    );
    totalTimeDiv.textContent = `Total Time Spent: ${totalElapsedTime}`;

    // div for the number of incorrect answers
    const incorrectCountDiv = document.createElement("p");
    incorrectCountDiv.classList.add(
      "mb-4",
      "text-center",
      "text-xl",
      "text-red-600"
    );
    incorrectCountDiv.textContent = `Incorrect Answers: ${incorrectCount}`;

    // container for the quiz result summary
    const summaryContainer = document.createElement("div");
    summaryContainer.classList.add("mb-8", "w-full");

    // progress bar for the correct answers
    const correctAnswersProgressBar = document.createElement("div");
    correctAnswersProgressBar.classList.add(
      "mb-4",
      "flex",
      "flex-col",
      "justify-center",
      "items-center"
    );
    const correctAnswersPercentage = Math.floor(
      ((results.length - incorrectCount) / results.length) * 100
    );
    // <div class="flex h-2 mb-4 overflow-hidden text-xs bg-green-200 rounded">
    //   <div
    //     style="width:${correctAnswersPercentage}%"
    //     class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
    //   ></div>
    // </div>;
    // <span class="text-xs font-semibold w-full inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
    //   ${correctAnswersPercentage}%
    // </span>;
    correctAnswersProgressBar.innerHTML = `
    <p class="text-lg font-semibold mb-2 text-green-600">You scored ${correctAnswersPercentage}% in this test</p>
    <div class="relative pt-1">
      <div class="flex mb-2 items-center justify-between">
        <div>
          
        </div>
      </div>
      
    </div>
  `;

    summaryContainer.appendChild(correctAnswersProgressBar);

    // progress bar for the incorrect answers
    //   const incorrectAnswersProgressBar = document.createElement("div");
    //   incorrectAnswersProgressBar.classList.add("mb-4");
    //   const incorrectAnswersPercentage = 100 - correctAnswersPercentage;
    //   incorrectAnswersProgressBar.innerHTML = `
    //   <p class="text-lg font-semibold mb-2 text-red-600">Incorrect Answers: ${incorrectAnswersPercentage}%</p>
    //   <div class="relative pt-1">
    //     <div class="flex mb-2 items-center justify-between">
    //       <div>
    //         <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-red-200 text-red-800">
    //           ${incorrectAnswersPercentage}%
    //         </span>
    //       </div>
    //     </div>
    //     <div class="flex h-2 mb-4 overflow-hidden text-xs bg-red-200 rounded">
    //       <div style="width:${incorrectAnswersPercentage}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
    //     </div>
    //   </div>
    // `;

    //   summaryContainer.appendChild(incorrectAnswersProgressBar);

    // Create cards for displaying individual results
    const resultsCards = document.createElement("div");
    resultsCards.classList.add(
      "flex",
      "flex-wrap",
      "justify-center",
      "w-full",
      "gap-4",
      "sm:gap-6"
    );

    // Iterate through each result and create a card for each
    results.forEach((result, index) => {
      const card = document.createElement("div");
      card.classList.add(
        "bg-white",
        "p-4",
        "rounded-lg",
        "shadow-md",
        "w-full",
        "sm:w-80"
      );

      // Display the result in the specified format
      const resultText = result.isCorrect
        ? `${result.problemText} = ${result.userAnswer}`
        : `${result.problemText} is not = ${result.userAnswer}\n
        <p>Correct Answer: ${result.correctAnswer}</p>`;

      card.innerHTML = `
            <p class="text-lg font-semibold text-indigo-600 mb-2">Problem ${
              index + 1
            }</p>
            <p class="${
              result.isCorrect ? "text-green-600" : "text-red-600"
            } font-semibold mt-2">Result: ${
        result.isCorrect ? "Correct" : "Incorrect"
      }</p>
            <p class="text-gray-700">${resultText}</p>
        `;

      resultsCards.appendChild(card);
    });

    // Create a "Back" button
    const backButton = document.createElement("button");
    backButton.textContent = "Back to Home";
    backButton.classList.add(
      "bg-indigo-600",
      "text-white",
      "py-2",
      "px-4",
      "rounded-md",
      "hover:bg-indigo-700",
      "focus:outline-none",
      "focus:ring",
      "focus:ring-indigo-200",
      "focus:ring-opacity-50",
      "mt-8",
      "sm:mt-12"
    );
    backButton.addEventListener("click", function () {
      window.location.href = "/";
    });

    // Append all elements to the results container
    resultsContainer.appendChild(header);
    resultsContainer.appendChild(totalTimeDiv);
    resultsContainer.appendChild(incorrectCountDiv);
    resultsContainer.appendChild(summaryContainer);
    resultsContainer.appendChild(resultsCards);
    resultsContainer.appendChild(backButton);

    // Add the results container to the document body
    document.body.innerHTML = "";
    document.body.appendChild(resultsContainer);
  }
});
{
  /* </script> */
}
