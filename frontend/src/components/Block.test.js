import React from 'react';
import Block from './Block';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import HeaderRow from "./HeaderRow";



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
        shallow( <Block key={idx} id={idx} guid={item.guid} parent={item.parent} nonce={item.nonce}
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

    it('triggers textareaOnChange callback on input area change', () => {
        const headerRow = shallow(<Block key={idx} id={idx} guid={item.guid} parent={item.parent} nonce={item.nonce}
                                         hash={item.hash} mineFunction={mineBlockMock} mined={item.mined}
                                         textareaOnChange={textareaOnChangeMock} checkId={item.checkId} checkItems={item.checkItems}
                                         checkCost={item.checkCost} checkTip={item.checkTip}
        />);
        headerRow.find("#addItemModalButton").simulate('click');
        expect(addBlockMock.mock.calls.length).toEqual(1);
    });
});