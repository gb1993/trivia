import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import { Link } from 'react-router-dom';
import { ACTION_SAVE_HASH } from '../redux/action';
import Logout from './Logout';
import settings from './images/settings.png';
import './Style.css';

class Header extends Component {
  componentDidMount() {
    this.generateGravatarHash();
  }

  generateGravatarHash = () => {
    const { gravatarEmail, saveGravatarHash } = this.props;
    const gravatarHash = md5(gravatarEmail).toString();
    saveGravatarHash(gravatarHash);
  }

  render() {
    const { name, score, gravatarHash } = this.props;
    return (
      <nav>
        <img
          src={ `https://www.gravatar.com/avatar/${gravatarHash}` }
          alt="avatar"
          data-testid="header-profile-picture"
        />
        <section>
          <p><strong>{ name }</strong></p>
          <p>{ `Score: ${score}` }</p>
        </section>
        <section>
          <button type="button" className="logout">
            <Link to="/settings"><img src={ settings } alt="Settings button" /></Link>
          </button>
          <Logout />
        </section>
      </nav>
    );
  }
}

Header.propTypes = {
  name: PropTypes.string,
  gravatarEmail: PropTypes.string,
}.isRequired;

const mapStateToProps = ({ player: { name, score, gravatarEmail, gravatarHash } }) => ({
  name,
  score,
  gravatarEmail,
  gravatarHash,
});

const mapDispatchToProps = (dispatch) => ({
  saveGravatarHash: (gravatarHash) => dispatch(ACTION_SAVE_HASH(gravatarHash)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
