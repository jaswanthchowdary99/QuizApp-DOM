document.addEventListener("DOMContentLoaded", function () {
    let quizData = null;
    let currentSectionIndex = null;
    let currentQuestionIndex = 0;
    let score = 0;
  
    const quizContainer = document.getElementById("quiz-container");
    const questionContainer = document.getElementById("question-container");
    const resultContainer = document.getElementById("result-container");
    const questionElement = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-button");
    const scoreElement = document.getElementById("score");
    const finalScoreElement = document.getElementById("final-score");
    const homeButton = document.getElementById("home-button");
    const homeButtonResult = document.getElementById("home-button-result");
  
   
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        quizData = data.quiz;
        displaySections(); 
      })
      .catch((error) => console.error("Error loading data:", error));
  
   
    function displaySections() {
      quizContainer.style.display = "grid";
      questionContainer.style.display = "none";
      resultContainer.style.display = "none";
    }
  
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
      }
    }

    function startSection(index) {
      currentSectionIndex = index;
      currentQuestionIndex = 0;
      score = 0; 
      updateScoreDisplay(); 
      quizContainer.style.display = "none";
      questionContainer.style.display = "block";
      resultContainer.style.display = "none";
      const section = Object.keys(quizData)[currentSectionIndex];
      const questions = quizData[section];
      shuffleArray(questions)
      loadQuestion();
    }
  
    function loadQuestion() {
      const section = Object.keys(quizData)[currentSectionIndex];
      const questions = quizData[section];
  
      if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        displayQuestion(question);
      } else {
        showResult();
      }
    }
  
    function displayQuestion(question) {
      questionElement.textContent = question.question;
      optionsContainer.innerHTML = "";
      feedbackElement.textContent = "";
      nextButton.style.display = "none";
    
      if (question.type === "mcq") {
        question.options.forEach((option) => {
          const button = document.createElement("div");
          button.textContent = option;
          button.classList.add("option");
          button.addEventListener("click", () =>
            checkAnswer(button, option, question.answer)
          );
          optionsContainer.appendChild(button);
        });
      } else if (question.type === "one_word") {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter your answer";
        optionsContainer.appendChild(input);
    
        const submitButton = document.createElement("button");
        submitButton.classList.add("submit-button");
        submitButton.textContent = "Submit";
        submitButton.addEventListener("click", () =>
          checkAnswer(submitButton, input.value.trim(), question.answer)
        );
        optionsContainer.appendChild(submitButton);
      }
    }
    
    function checkAnswer(selectedElement, selected, correct) {
      selectedElement.style.backgroundColor = "#0056b3";
      selectedElement.style.color = "#e7dddd";
      const allOptions = optionsContainer.querySelectorAll(".option, .submit-button");
      allOptions.forEach((option) => {
        option.style.pointerEvents = "none";
      });
    
      if (selected.toLowerCase() === correct.toLowerCase()) {
        feedbackElement.style.color = "green";
        feedbackElement.textContent = "Correct Answer!";
        score++;
        updateScoreDisplay();
      } else {
        feedbackElement.style.color = "red";
        feedbackElement.innerHTML = `Wrong the correct answer is: <strong class="answer">${correct}</strong>`;
      }
    
      nextButton.style.display = "block";
    }
    
    function updateScoreDisplay() {
      scoreElement.textContent = `Score: ${score}`;
    }
  
    function showResult() {
      questionContainer.style.display = "none";
      resultContainer.style.display = "flex";
      finalScoreElement.textContent = `Your Final Score:  ${score}`; 
    }
  
  
    function goHome() {
      displaySections();
    }
  
    document.querySelectorAll(".section").forEach((button, index) => {
      button.addEventListener("click", () => startSection(index));
    });
  
    nextButton.addEventListener("click", () => {
      currentQuestionIndex++;
      loadQuestion();
    });
  
    homeButton.addEventListener("click", goHome);
    homeButtonResult.addEventListener("click", goHome);

  });
  