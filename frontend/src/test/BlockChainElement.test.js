import React from 'react';
import BlockChainElement from '../components/BlockChainElement';
import {mount, shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {Block} from "../components/Block";
import HeaderRow from "../components/HeaderRow";
import BlockNode from "../js/BlockNode";

describe('Test <BlockChainElement>', () => {
    const blockA = new BlockNode('guid-a', {
        id: 'check-id-a',
        items: 'items-a',
        cost: 10.99,
        tip: 1.99
    }, null);
    const blockB = new BlockNode('guid-b', {
        id: 'check-id-b',
        items: 'items-b',
        cost: 10.99,
        tip: 1.99
    }, blockA);

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('renders without crashing', () => {
        shallow(<BlockChainElement/>);
    });

    it('matches snapshot', () => {
        const tree = renderer.create(
            <BlockChainElement/>,
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('initially renders no blocks', () => {
        const wrapper = shallow(<BlockChainElement/>);
        expect(wrapper.find(Block)).toHaveLength(0);
        expect(wrapper.find(HeaderRow)).toHaveLength(1);
    });

    it('renders blocks', () => {
        const wrapper = shallow(<BlockChainElement/>);
        expect(wrapper.find(Block)).toHaveLength(0);
        let blocks = [blockA];
        wrapper.setState({blocks: blocks});
        expect(wrapper.find(Block)).toHaveLength(1);
        blocks.push(blockB);
        wrapper.setState({blocks: blocks});
        expect(wrapper.find(Block)).toHaveLength(2);
    });

    it('calls resetAllBlocks on num zeroes change', () => {
        const spy = jest.spyOn(BlockChainElement.prototype, "resetAllBlocks");
        const wrapper = mount(<BlockChainElement/>);
        wrapper.find('#numZeroes').first().simulate('change');

        expect(spy).toHaveBeenCalled();
    });

    it('calls addBlock on add button click', () => {
        const spy = jest.spyOn(BlockChainElement.prototype, "addBlock");
        const wrapper = mount(<BlockChainElement/>);
        wrapper.setState({blocks: [blockA]});
        wrapper.find('#addItemModalButton').first().simulate('click');

        expect(spy).toHaveBeenCalled();
    });

    it('calls mineBlock on mine button click', () => {
        const spy = jest.spyOn(BlockChainElement.prototype, "mineBlock");
        const wrapper = mount(<BlockChainElement/>);
        wrapper.setState({blocks: [blockA, blockB]});
        wrapper.find('.mine-btn').first().simulate('click');

        expect(spy).toHaveBeenCalled();
    });

    it('calls handleTamper on data field tamper', () => {
        const spy = jest.spyOn(BlockChainElement.prototype, "handleTamper");
        const wrapper = mount(<BlockChainElement/>);
        wrapper.setState({blocks: [blockA]});
        wrapper.find('#checkId-0').first().simulate('change');
        wrapper.find('#checkItems-0').first().simulate('change');
        wrapper.find('#checkCost-0').first().simulate('change');
        wrapper.find('#checkTip-0').first().simulate('change');

        expect(spy).toHaveBeenCalledTimes(4)
    });
});