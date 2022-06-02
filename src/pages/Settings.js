import React from 'react';

class Settings extends React.Component {
  render() {
    return (
      <>
        <h1 data-testid="settings-title">Settings</h1>
        <form>
          <label htmlFor="dificulty">
            Dificulty
            <select>
              <option value="harder">Harder</option>
              <option value="normal">Normal</option>
              <option value="normal">Easy</option>
            </select>
          </label>
          <label htmlFor="theme">
            Theme
            <select>
              <option value="General">General</option>
              <option value="normArtal">Art</option>
              <option value="Sports">Sports</option>
            </select>
          </label>
        </form>
      </>
    );
  }
}

export default Settings;
