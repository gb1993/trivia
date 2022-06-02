import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './Style.css';

class Ranking extends React.Component {
  state = {
    ranking: [],
  }

  componentDidMount() {
    this.saveRankingOnState(this.getRanking());
  }

  getRanking = () => JSON.parse(localStorage.getItem('ranking'));

  saveRankingOnState = (ranking) => {
    this.setState({
      ranking,
    }, () => this.orderRankingByScore());
  }

  orderRankingByScore = () => {
    const { ranking } = this.state;
    const sortedRanking = ranking.sort((a, b) => b.score - a.score);
    this.setState({
      ranking: sortedRanking,
    });
  }

  render() {
    const { ranking } = this.state;
    return (
      <>
        <Header />
        <h1 data-testid="ranking-title">Ranking</h1>
        <Link to="/game">Back</Link>
        <Link to="/settings">Settings</Link>
        <div className="gameContainer">
          {
            ranking.map(({ name, score, gravatarHash }, index) => (
              <li className="ranking" key={ index }>
                <span>{ index + 1 }</span>
                <img
                  src={ gravatarHash }
                  alt="avatar"
                />
                <span data-testid={ `player-name-${index}` }>
                  {name}
                </span>
                <span><strong>{`Score: ${score}`}</strong></span>
              </li>
            ))
          }
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ player: { name, score, gravatarHash } }) => ({
  name,
  score,
  gravatarHash,
});

export default connect(mapStateToProps, null)(Ranking);
