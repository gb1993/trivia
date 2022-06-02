import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { decode } from 'he';
import { ACTION_ADD_SCORE } from '../redux/action';
import Header from '../components/Header';
import loadingLogo from './images/loadingLogo.gif';
import './Style.css';

class Game extends React.Component {
  state= {
    perguntas: '',
    shuffledAnswers: [],
    currQuestion: 0,
    answersOptions: true,
    respondido: false,
    timer: 30,
    loading: true,
  }

  async componentDidMount() {
    const {
      history,
    } = this.props;
    try {
      const token = localStorage.getItem('token');
      const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.response_code !== 0) {
        localStorage.removeItem('token');
        return history.push('/');
      } this.setState({
        perguntas: data.results,
        loading: false,
      }, () => this.shuffleAnswers());
    } catch (error) {
      console.log(error);
    }
    history.push('/game');

    this.startCountdown();
  }

  componentDidUpdate() {
    const { timer } = this.state;
    if (timer < 0) {
      clearInterval(this.interval);
      this.stopCountdown();
    }
  }

  startCountdown = () => {
    const ONE_SECOND = 1000;
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
    }, ONE_SECOND);
  }

  stopCountdown = () => {
    this.setState({
      timer: 0,
    }, () => clearInterval(this.interval));
  }

  resetCountdown = () => {
    this.setState({
      timer: 30,
    });
  }

  shuffleAnswers = () => {
    const { perguntas, currQuestion } = this.state;
    const answers = [
      ...perguntas[currQuestion].incorrect_answers,
      perguntas[currQuestion].correct_answer,
    ];
    const answersArray = answers.map((answer) => {
      if (answer === perguntas[currQuestion].correct_answer) {
        return { certa: true, answer };
      }
      return { certa: false, answer };
    });

    const ROUND = 0.5;
    const shuffledAnswers = answersArray.sort(() => Math.random() - ROUND);
    this.setState({
      shuffledAnswers,
    });
  }

  handleAnswers = () => this.setState({ answersOptions: false });

  calculatePoints = (difficulty) => {
    const { timer } = this.state;
    const TEN = 10;
    const ONE = 1;
    const TWO = 2;
    const THREE = 3;
    let difficultyRate = 1;
    if (difficulty === 'easy') {
      difficultyRate = ONE;
    } else if (difficulty === 'medium') {
      difficultyRate = TWO;
    } else {
      difficultyRate = THREE;
    }
    return TEN + (timer * difficultyRate);
  }

  getAnswer = () => {
    this.setState({
      respondido: true,
    }, () => clearInterval(this.interval));
  }

  nextQuestion = () => {
    const { currQuestion } = this.state;
    this.setState({
      currQuestion: currQuestion + 1,
      respondido: false,
      answersOptions: true,
    }, () => {
      this.shuffleAnswers();
      this.resetCountdown();
      this.startCountdown();
    });
  }

  render() {
    const { addScore, history } = this.props;
    const { perguntas, shuffledAnswers, currQuestion, respondido, timer,
      answersOptions, loading,
    } = this.state;
    const FOUR = 4;
    return (
      <div>
        <Header />
        <div className="gameContainer">
          {loading ? <img src={ loadingLogo } alt="loading gif" width="400px" />
            : <>
              <section className="questions">
                <h1 data-testid="question-category">
                  {decode(perguntas && perguntas[currQuestion].category)}
                </h1>
                <h2 data-testid="question-text">
                  {decode(perguntas && perguntas[currQuestion].question)}
                </h2>
              </section>
              <section data-testid="answer-options" className="questions">
                {
                  shuffledAnswers.map(({ certa, answer }, i) => (
                    certa
                      ? (
                        <button
                          key={ i }
                          className={
                            !answersOptions || timer <= 0 ? 'correctAnswer' : 'answer'
                          }
                          type="button"
                          data-testid="correct-answer"
                          disabled={ timer === 0 || respondido }
                          onClick={ () => {
                            addScore(this.calculatePoints(
                              perguntas[currQuestion].difficulty,
                            ));
                            this.getAnswer();
                            this.handleAnswers();
                          } }
                        >
                          {decode(answer)}
                        </button>
                      ) : (
                        <button
                          key={ i }
                          className={
                            !answersOptions || timer <= 0 ? 'wrongAnswer' : 'answer'
                          }
                          type="button"
                          data-testid={ `wrong-answer-${i}` }
                          disabled={ timer === 0 || respondido }
                          onClick={ () => {
                            this.getAnswer();
                            this.handleAnswers();
                          } }
                        >
                          { decode(answer) }
                        </button>
                      )
                  ))
                }
                {(respondido || timer === 0) && (
                  <button
                    className="answer"
                    data-testid="btn-next"
                    type="button"
                    onClick={ currQuestion !== FOUR
                      ? () => this.nextQuestion()
                      : () => history.push('/feedback') }
                  >
                    Next
                  </button>
                ) }
              </section>
              <div className="timer">
                <span>{`Timer: ${timer}`}</span>
              </div>
            </>}
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  add: PropTypes.func,
}.isRequired;

const mapDispatchToProps = (dispatch) => ({
  addScore: (score) => dispatch(ACTION_ADD_SCORE(score)),
});

export default connect(null, mapDispatchToProps)(Game);
