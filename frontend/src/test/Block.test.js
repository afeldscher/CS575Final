import React from 'react';
import {Block, DisabledTextAreaInput, TextBoxInput} from '../components/Block';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import BlockDataContent from "../components/BlockDataContent";


describe('Test <Block>', () => {
    const idx = 1;
    const item = {
        parent: '0000',
        nonce: 100,
        hash: '1234567890abcdef',
        checkId: 'check-id',
        checkItems: 'check-items',
        checkCost: 10.05,
        checkTip: 1.05,
        mined: true
    };
    const mineBlockMock = jest.fn();
    const textareaOnChangeMock = jest.fn();

    it('renders without crashing', () => {
        shallow(<Block key={idx} id={idx} guid={item.guid} parent={item.parent} nonce={item.nonce}
                       hash={item.hash} mineFunction={mineBlockMock} mined={item.mined}
                       textareaOnChange={textareaOnChangeMock} checkId={item.checkId} checkItems={item.checkItems}
                       checkCost={item.checkCost} checkTip={item.checkTip}
        />);
    });

    it('matches snapshot', () => {
        const tree = renderer.create(
            <Block key={idx} id={idx} guid={item.guid} parent={item.parent} nonce={item.nonce}
                   hash={item.hash} mineFunction={mineBlockMock} mined={item.mined}
                   textareaOnChange={textareaOnChangeMock} checkId={item.checkId} checkItems={item.checkItems}
                   checkCost={item.checkCost} checkTip={item.checkTip}
            />,
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders child elements', () => {
        const wrapper = shallow(<Block key={idx} id={idx} guid={item.guid} parent={item.parent} nonce={item.nonce}
                                       hash={item.hash} mineFunction={mineBlockMock} mined={item.mined}
                                       textareaOnChange={textareaOnChangeMock} checkId={item.checkId}
                                       checkItems={item.checkItems}
                                       checkCost={item.checkCost} checkTip={item.checkTip}
        />);
        expect(wrapper.find(TextBoxInput)).toHaveLength(2);
        expect(wrapper.find(DisabledTextAreaInput)).toHaveLength(2);
        expect(wrapper.find(BlockDataContent)).toHaveLength(1);
        expect(wrapper.find('button')).toHaveLength(1);
    });
});