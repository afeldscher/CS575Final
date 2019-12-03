import React from 'react';
import BlockDataContent from './BlockDataContent';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

describe('Test <BlockDataContent>', () => {
    const textareaOnChange = jest.fn();

    it('renders without crashing', () => {
        shallow(<BlockDataContent id="test-id" checkId="check-id" checkItems="check-items"
                                  checkCost={10.04} checkTip={1.05} onChangeFct={textareaOnChange}/>);
    });

    it('matches snapshot on render', () => {
        const tree = renderer.create(
            <BlockDataContent id="test-id" checkId="check-id" checkItems="check-items"
                              checkCost={10.04} checkTip={1.05} onChangeFct={textareaOnChange}/>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('triggers textareaOnChange callback on change to block text area field', () => {
        const blockTextArea = shallow(<BlockDataContent id="test-id" checkId="check-id" checkItems="check-items"
                                                    checkCost={10.04} checkTip={1.05} onChangeFct={textareaOnChange}/>);
        blockTextArea.find("#checkItems-test-id").simulate('change');
        expect(textareaOnChange.mock.calls.length).toEqual(1);
    });
});
