import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ACTION_RESET_SCORE } from '../redux/action';
import Header from '../components/Header';
import Scoreboard from '../components/Scoreboard';
import sadEmoji from './images/sad.png';
import happyEmoji from './images/happy.png';
import './Style.css';

class Feedback extends Component {
  componentDidMount() {
    this.checkLocalStorage();
  }

  getRanking = () => JSON.parse(localStorage.getItem('ranking'));

  saveRanking = () => {
    const { name, score, gravatarHash } = this.props;
    const playerRank = {
      name,
      score,
      gravatarHash: `https://www.gravatar.com/avatar/${gravatarHash}`,
    };
    const prevRanking = this.getRanking();
    const ranking = [...prevRanking, playerRank];
    localStorage.setItem('ranking', JSON.stringify(ranking));
  }

  checkLocalStorage() {
    if (!JSON.parse(localStorage.getItem('ranking'))) {
      localStorage.setItem('ranking', JSON.stringify([]));
    } this.saveRanking();
  }

  render() {
    const { assertions, resetScore } = this.props;
    const THREE = 3;
    return (
      <>
        <Header />
        <div className="gameContainer">
          {
            assertions >= THREE ? <img src={ happyEmoji } alt="happy emoji" />
              : <img src={ sadEmoji } alt="sad emoji" />
          }
          <h1 data-testid="feedback-text">
            {assertions >= THREE ? 'Well Done!' : 'Could be better...'}
          </h1>
          <Scoreboard />
          <Link to="/game">
            <button
              className="answer"
              type="submit"
              data-testid="btn-play-again"
              onClick={ () => resetScore() }
            >
              Play Again
            </button>
          </Link>
          <Link
            to="/ranking"
            data-testid="btn-ranking"
          >
            <button type="button" className="answer">Ranking</button>
          </Link>
        </div>
      </>
    );
  }
}

Feedback.propTypes = {
  assertions: PropTypes.number,
  resetScore: PropTypes.func,

}.isRequired;

const mapStateToProps = ({ player: { name, assertions, score, gravatarHash } }) => ({
  name,
  assertions,
  score,
  gravatarHash,
});

const mapDispatchToProps = (dispatch) => ({
  resetScore: () => dispatch(ACTION_RESET_SCORE()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
