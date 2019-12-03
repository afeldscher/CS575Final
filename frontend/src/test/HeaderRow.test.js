import React from 'react';
import HeaderRow from '../components/HeaderRow';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

describe('Test <HeaderRow>', () => {
    const resetAllBlocksMock = jest.fn();
    const addBlockMock = jest.fn();

    it('renders without crashing', () => {
        shallow(<HeaderRow resetBlockFunction={resetAllBlocksMock} addBlockFunction={addBlockMock}/>);
    });

    it('matches snapshot', () => {
        const tree = renderer.create(
            <HeaderRow resetBlockFunction={resetAllBlocksMock} addBlockFunction={addBlockMock} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });


    it('triggers addBlock callback on modal add item click', () => {
        const headerRow = shallow(<HeaderRow resetBlockFunction={resetAllBlocksMock} addBlockFunction={addBlockMock}/>);
        headerRow.find("#addItemModalButton").simulate('click');
        expect(addBlockMock.mock.calls.length).toEqual(1);
    });

});
