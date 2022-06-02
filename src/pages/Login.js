import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../redux/action';
import './Style.css';
import logo from './images/trivia.png';
import Footer from '../components/Footer';

class Login extends React.Component {
  state = {
    name: '',
    gravatarEmail: '',
    disabled: true,
  }

handleClick = async () => {
  const {
    history,
  } = this.props;
  try {
    const url = 'https://opentdb.com/api_token.php?command=request';
    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem('token', data.token);
  } catch (error) {
    console.log(error);
  }
  history.push('/game');
};

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    }, () => this.validateLogin());
  }

  validateLogin = () => {
    const { name, gravatarEmail } = this.state;
    const regexEmail = (
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(gravatarEmail));
    if (name !== '' && gravatarEmail !== '' && regexEmail === true) {
      return this.setState({ disabled: false });
    }
    this.setState({ disabled: true });
  }

  render() {
    const { name, gravatarEmail, disabled } = this.state;
    const { ACTION_LOGIN } = this.props;
    return (
      <div className="loginStyle">
        <img src={ logo } alt="Trivia logo" />
        <form className="loginForm" action="#">
          <label htmlFor="name">
            Name
          </label>
          <input
            required
            type="text"
            name="name"
            value={ name }
            onChange={ this.handleChange }
            data-testid="input-player-name"
            id="name"
            placeholder="Enter your Name"
          />
          <label htmlFor="gravatarEmail">
            Email
          </label>
          <input
            required
            type="email"
            name="gravatarEmail"
            value={ gravatarEmail }
            onChange={ this.handleChange }
            data-testid="input-gravatar-email"
            id="gravatarEmail"
            placeholder="Enter your Email"
          />
          <button
            className={ disabled ? 'loginButton' : 'loginButtonOk' }
            type="button"
            disabled={ disabled }
            data-testid="btn-play"
            onClick={ () => {
              ACTION_LOGIN(name, gravatarEmail);
              this.handleClick();
            } }
          >
            Play
          </button>
        </form>
        <Footer />
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  ACTION_LOGIN: PropTypes.func,
}.isRequired;

const mapDispatchToProps = (dispatch) => ({
  ACTION_LOGIN: (name, gravatarEmail) => dispatch(login(name, gravatarEmail)),
});

export default connect(null, mapDispatchToProps)(Login);
