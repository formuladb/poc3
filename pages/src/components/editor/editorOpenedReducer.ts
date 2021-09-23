import { Reducer } from 'redux';
import { TOGGLE_EDITOR, toggleEditor } from './actions';


type State = boolean;
type Action =
    | ReturnType<typeof toggleEditor>;

const editorOpenedReducer: Reducer<State, Action> = (
    previousState = false,
    action
) => {
    if (action.type === TOGGLE_EDITOR) {
        return !action.payload;
    }
    return previousState;
};

export default editorOpenedReducer;
