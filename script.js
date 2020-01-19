let x = 75;
let question = 0;

const getQuestion = () => {
    let questionsDiv = $('#quiz-questions');
    if (question > 0) {
        questionsDiv.empty();
    }
    let currentDiv = $('<div>');
    currentDiv.attr('class', 'container text-center');
    currentDiv.attr('data-number', question);
    questionsDiv.append(currentDiv);

    let currentQuestion = $('<h1>');
    // currentQuestion.attr('class', '');
    currentQuestion.text(questions[question].title);
    currentDiv.append(currentQuestion);

    let choiceList = $('<ol>');
    choiceList.attr('class', 'pt-5');
    currentDiv.append(choiceList);
    questions[question].choices.map(choice => {
        let option = $('<li>');
        option.attr('class', 'list-group-item d-flex justify-content-between align-items-center list-group-item-info w-25');
        option.attr('data-choice', choice);
        option.text(choice);
        choiceList.append(option);
        let span = $('<span>');
        span.attr('class', 'badge badge-light badge-pill')
        span.text(' ');
        option.append(span);

        option.on('mouseenter', (e) => {
            e.target.classList.remove('list-group-item-info');
            e.target.classList.add('list-group-item-primary');
        })

        option.on('mouseleave', (e) => {
            e.target.classList.remove('list-group-item-primary');
            e.target.classList.add('list-group-item-info');
            
        })
    })
    
}

const startTimer = () => {
    var timer = setInterval(() => {
        if (x < 1) {
            clearInterval(timer);
            // **** TODO call sorcard function
        } else {
            x--;
            $('.card-title').text('Seconds Remaining: ' + x);
        }
        
    }, 1000);

    timer;
}

$('#start-button').on('click', () => {
    $('#start').hide();
    startTimer();
    getQuestion();
})