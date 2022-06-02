import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Scoreboard extends Component {
  render() {
    const { score, assertions } = this.props;
    return (
      <div>
        <p data-testid="feedback-total-score">{`Score: ${score}`}</p>
        <p data-testid="feedback-total-question">{`Assertions: ${assertions}`}</p>
      </div>
    );
  }
}

Scoreboard.propTypes = {
  score: PropTypes.number,
  assertions: PropTypes.number,
}.isRequired;

const mapStateToProps = ({
  player: { score, assertions },
}) => ({
  score,
  assertions,
});

export default connect(mapStateToProps, null)(Scoreboard);
