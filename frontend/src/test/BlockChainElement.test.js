import React from 'react';
import BlockChainElement from '../components/BlockChainElement';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import {Block, DisabledTextAreaInput, TextBoxInput} from "../components/Block";
import HeaderRow from "../components/HeaderRow";
import BlockNode from "../js/BlockNode";

describe('Test <BlockChainElement>', () => {
    const blockA = new BlockNode('guid-a', {
        id: 'check-id-a',
        items: 'items-a',
        cost: 10.99,
        tip: 1.99
    },  null);
    const blockB = new BlockNode('guid-b', {
        id: 'check-id-b',
        items: 'items-b',
        cost: 10.99,
        tip: 1.99
    },  blockA);

    it('renders without crashing', () => {
        shallow(<BlockChainElement />);
    });

    it('matches snapshot', () => {
        const tree = renderer.create(
            <BlockChainElement />,
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders child elements', () => {
        const wrapper = shallow(<BlockChainElement/>);
        wrapper.setState({blocks: [blockA]});
        expect(wrapper.find(HeaderRow)).toHaveLength(1);
        expect(wrapper.find(Block)).toHaveLength(1);
    });

    it('renders new blocks', () => {
        const wrapper = shallow(<BlockChainElement/>);
        let blocks = [blockA];
        wrapper.setState({blocks: blocks});
        expect(wrapper.find(Block)).toHaveLength(1);
        blocks.push(blockB);
        wrapper.setState({blocks: blocks});
        expect(wrapper.find(Block)).toHaveLength(2);
    });

});