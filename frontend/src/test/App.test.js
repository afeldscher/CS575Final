import React from 'react';
import App from '../App';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import BlockChainElement from "../components/BlockChainElement";
import HeaderRow from "../components/HeaderRow";
import {Block} from "../components/Block";

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

  it('renders child elements', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(BlockChainElement)).toHaveLength(1);
    expect(wrapper.find('nav')).toHaveLength(1);
  });
});