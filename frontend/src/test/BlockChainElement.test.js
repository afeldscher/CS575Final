import React from 'react';
import BlockChainElement from '../components/BlockChainElement';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

describe('Test <BlockChainElement>', () => {
    it('renders without crashing', () => {
        shallow(<BlockChainElement />);
    });

    it('matches snapshot', () => {
        const tree = renderer.create(
            <BlockChainElement />,
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});