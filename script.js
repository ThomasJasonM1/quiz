let x = 75;
let question = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

const getQuestion = () => {
    if (question >= questions.length) {
        finished()
        return;
    }
    let questionsDiv = $('#quiz-questions');
    if (question > 0) {
        questionsDiv.empty();
    }
    // I'm adding this div strickly for styling. I wanted to be able to contol the h1 and ol separately
    let currentDiv = $('<div>');
    currentDiv.attr('class', 'container text-center');
    currentDiv.attr('data-number', question);
    questionsDiv.append(currentDiv);

    // This will house the question
    let currentQuestion = $('<h1>');
    currentQuestion.text(questions[question].title);
    currentDiv.append(currentQuestion);

    // This will house the options
    let choiceList = $('<ol>');
    choiceList.attr('class', 'pt-5');
    currentDiv.append(choiceList);

    // This loop will add a list item for each option in the choices array
    questions[question].choices.map(choice => {
        let option = $('<li>');
        option.attr('class', 'list-group-item d-flex justify-content-between align-items-center list-group-item-info');
        option.attr('data-choice', choice);
        option.text(choice);
        choiceList.append(option);
        let span = $('<span>');
        span.attr('class', 'badge badge-light badge-pill')
        span.text(' ');
        option.append(span);

        // The two event listeners below will cause the option being hoverd over to change colors
        // This will let the user visually know what option they are on
        option.on('mouseenter', (e) => {
            e.target.classList.remove('list-group-item-info');
            e.target.classList.add('list-group-item-primary');
        })
        option.on('mouseleave', (e) => {
            e.target.classList.remove('list-group-item-primary');
            e.target.classList.add('list-group-item-info');
            
        })

        // Adding an event listener to the option selected
        option.on('click', (e) => {
            let selected = e.target.getAttribute('data-choice');
            let answer = questions[question].answer;
            if (selected === answer) {
                correctAnswers++;
            } else {
                wrongAnswers++; 
                x -= 10;
            }
            console.log(`correctAnswers: ${correctAnswers}, wrongAnswers: ${wrongAnswers}`);
            question ++;
            getQuestion();
        })
    })
    
}

// This function will be called when the timer runs out or the questions are complete
const finished = () => {
    console.log('here');
    $('#quiz-questions').empty();
    clearInterval(timer);
}

// This has to be declared in an outer scope, or I cannot turn it off from a different function
let timer;

// This function is responsible for the timer counting down
const startTimer = () => {
    timer = setInterval(() => {
        if (x < 1) {
            clearInterval(timer);
            // **** TODO call sore card function
        } else {
            x--;
            $('.card-title').text('Seconds Remaining: ' + x);
        }
        
    }, 1000);
    timer;
}

// We are starting here! When this is clicked, it will start displaying the questions
$('#start-button').on('click', () => {
    $('#start').hide();
    startTimer();
    getQuestion();
})