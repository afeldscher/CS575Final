import React from 'react';
import App from '../App';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

describe('Test <App>', () => {
  it('renders without crashing', () => {
    shallow(<App />);
  });

  it('matches snapshot', () => {
    const tree = renderer.create(
        <App />,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});