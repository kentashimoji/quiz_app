// グローバル変数
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// クイズデータを読み込み
async function loadQuizData() {
    try {
        const response = await fetch('questions.json');
        quizData = await response.json();
        initQuiz();
    } catch (error) {
        console.error('クイズデータの読み込みに失敗しました:', error);
        // フォールバック用のデータ
        quizData = [
            {
                question: "日本の首都はどこですか？",
                answers: ["大阪", "東京", "京都", "名古屋"],
                correct: 1
            }
        ];
        initQuiz();
    }
}

// 初期化
function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    document.getElementById('total-questions').textContent = quizData.length;
    document.querySelector('.quiz-content').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    showQuestion();
}

// 問題を表示
function showQuestion() {
    const question = quizData[currentQuestionIndex];
    answered = false;

    // 問題番号とスコアを更新
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('score').textContent = score;
    
    // プログレスバーを更新
    const progress = ((currentQuestionIndex) / quizData.length) * 100;
    document.getElementById('progress').style.width = progress + '%';

    // 問題文を表示
    document.getElementById('question').textContent = question.question;

    // 選択肢を表示
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });

    // 次へボタンを非表示
    document.getElementById('next-btn').style.display = 'none';
}

// 答えを選択
function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;
    const question = quizData[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');

    buttons.forEach((button, index) => {
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== question.correct) {
            button.classList.add('incorrect');
        }
        button.style.pointerEvents = 'none';
    });

    // スコアを更新
    if (selectedIndex === question.correct) {
        score++;
        document.getElementById('score').textContent = score;
    }

    // 次へボタンを表示
    setTimeout(() => {
        document.getElementById('next-btn').style.display = 'block';
    }, 1000);
}

// 次の問題へ
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// 結果を表示
function showResult() {
    document.querySelector('.quiz-content').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    
    const percentage = Math.round((score / quizData.length) * 100);
    document.getElementById('final-score').textContent = score + ' / ' + quizData.length;
    
    let message = '';
    if (percentage === 100) {
        message = '🏆 パーフェクト！素晴らしいです！';
    } else if (percentage >= 80) {
        message = '🌟 とても良くできました！';
    } else if (percentage >= 60) {
        message = '👍 よくできました！';
    } else if (percentage >= 40) {
        message = '📚 もう少し頑張りましょう！';
    } else {
        message = '💪 次回は頑張りましょう！';
    }
    
    document.getElementById('result-message').textContent = message;
}

// クイズを再開
function restartQuiz() {
    initQuiz();
}

// ページ読み込み時にクイズデータを読み込む
document.addEventListener('DOMContentLoaded', loadQuizData);