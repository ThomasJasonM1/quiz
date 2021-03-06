let x = 75;
let question = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let leaderboardArray = [];

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
            e.target.children[0].classList.remove('badge-light');
            e.target.children[0].classList.add('badge-primary');
        })
        option.on('mouseleave', (e) => {
            e.target.classList.remove('list-group-item-primary');
            e.target.classList.add('list-group-item-info');
            e.target.children[0].classList.add('badge-light');
            e.target.children[0].classList.remove('badge-primary');
            
        })

        // Adding an event listener to the option selected
        option.on('click', (e) => {
            let selected = e.target.getAttribute('data-choice');
            let answer = questions[question].answer;
            if (selected === answer) {
                correctAnswers++;
                $('#correct').text('Correct: ' + correctAnswers);
            } else {
                wrongAnswers++; 
                $('#incorrect').text('Incorrect: ' + wrongAnswers);
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

    let timeBonus = Math.round(x * .1)
    $('#score').text('Correct Answers: ' + correctAnswers);
    $('#time-bonus').text('Time Bonus: +' + timeBonus);
    $('#total').text('Total: ' + (correctAnswers + timeBonus));
    $('#finished').show();

    $('#initinals').on('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            leaderboardArray = JSON.parse(localStorage.getItem('players')) || [];
            console.log(leaderboardArray);
            let currentPlayer = {
                initials: e.target.value,
                score: (correctAnswers + timeBonus),
            }
            
            leaderboardArray.push(currentPlayer);
            localStorage.setItem('players', JSON.stringify(leaderboardArray));

            e.target.value = '';
            showLeaderboard();
        }
    })
}

// Shows the list of leaders and gives the player another option to replay the game
const showLeaderboard = () => {
    console.log('object');
    $('#finished').hide();
    $('#leaderboard').show();
    let leaderList = $('#leader-list');
    let currentHigh = 0;

    leaderboardArray.map(leader => {
        if (parseInt(leader.score) > currentHigh) currentHigh = leader.score;
        let leaderItem = $('<li>');
        leaderItem.attr('class', 'list-group-item d-flex justify-content-between align-items-center list-group-item-info');
        leaderItem.text(leader.initials + ': ' + leader.score);
        if (currentHigh === leader.score) {
            leaderList.prepend(leaderItem);
        } else {
            leaderList.append(leaderItem);
        }
    })

    let tryAgain = $('<button>');
    tryAgain.text('Try Again');
    tryAgain.attr('class', 'btn btn-secondary');
    tryAgain.attr('id', 'try-again-button');
    $('#try-again').append(tryAgain);

    $('#try-again-button').on('click', () => {
        x = 75;
        question = 0;
        correctAnswers = 0;
        wrongAnswers = 0;
        leaderboardArray = [];

        $('#leaderboard').hide();
        $('#correct').text('Correct: 0');
        $('#incorrect').text('Incorrect: 0');
        $('#seconds').text('75');
        $('#leader-list').empty();
        $('#initinals').unbind();
        $('#try-again-button').remove();
        $('#start').show();
    })
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
            $('#seconds').text(x);
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