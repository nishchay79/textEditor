import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './Editor.css'
import { firestore } from '../Utils/firebase';
import cookie from "react-cookies";
import { googleTranslate } from "./../Utils/googleTranslate.js";
import { calculateWordLength, calculateCharLength } from './../Utils/handleLength'
import { saveDataInLocalStorage, getDataFromLocalStorage, setText, setTextLength, setTextCharLength, resetData } from '../features/Editor/EditorSlice'

export default function Editor() {
    const [undo, setUndo] = useState([]);
    const [redo, setRedo] = useState([]);
    const [undoToggle, setUndoToggle] = useState(false);
    const [redoToggle, setRedoToggle] = useState(false);
    const [submitToggle, setSubmitToggle] = useState(true);
    const [translatedText, setTranslatedText] = useState("");
    const dispatch = useDispatch();
    const text = useSelector((state) => {
        return state.EditorReducer.text;
    });
    const textLength = useSelector((state) => {
        return state.EditorReducer.textLength;
    })
    const textCharLength = useSelector((state) => {
        return state.EditorReducer.textCharLength;
    })

    const handleData = (e) => {
        dispatch(setText(e.target.value));
        dispatch(setTextLength(e.target.value.length));
        const charLength = e.target.value.split(' ');
        const length = charLength.length;
        dispatch(setTextCharLength(length))
        let undoRef = [...undo, e.target.value]
        setUndo(undoRef);
    }
    const handleReset = () => {
        dispatch(resetData())
        setUndo([]);
        setRedo([]);
        setTranslatedText("");

    }
    useEffect(() => {
        dispatch(getDataFromLocalStorage());
    }, [])
    useEffect(() => {
        if (undo.length === 0 && redo.length === 0) {
            setRedoToggle(true);
            setUndoToggle(true);

        } else {
            setRedoToggle(false);
            setUndoToggle(false);
        }
        if (text === "") {
            setSubmitToggle(true);
        } else {
            setSubmitToggle(false);
        }
    })

    const handleUndo = () => {
        const undoItem = undo.pop()
        const len = undo[undo.length - 1];
        if (len === undefined) {
            dispatch(setTextLength(0));
            dispatch(setTextCharLength(0))
            dispatch(setText(""));
            return
        }
        if (undoItem === undefined) {
            return;
        }
        let redoRef = [...redo, undoItem];
        setRedo(redoRef);
        if (undo.length > 0) {
            dispatch(setText(undo[undo.length - 1]));
        } else {
            dispatch(setText(""));
        }
        const numOfWords = calculateWordLength(len);
        const numOfChar = calculateCharLength(len);
        dispatch(setTextCharLength(numOfWords))
        dispatch(setTextLength(numOfChar));
    }
    const handleSubmit = () => {
        firestore.collection("TextEditor").add({
            data: text,
            translatedData: translatedText
        })
        dispatch(resetData());
        setTranslatedText("");
        setUndo([]);
        setRedo([]);
    }
    const handleRedo = () => {
        let redoRef = [...redo];
        let redoItem = redoRef.pop();
        const len = redo[redo.length - 1];
        if (redoItem === undefined) {
            return;
        }
        setRedo(redoRef);
        setUndo([...undo, redoItem]);
        dispatch(setText(redoItem));
        const numOfWords = calculateWordLength(len);
        const numOfChar = calculateCharLength(len);
        dispatch(setTextCharLength(numOfWords))
        dispatch(setTextLength(numOfChar));
    }
    const handleDraft = () => {
        dispatch(saveDataInLocalStorage(text));
    }
    const handleTranslation = () => {
        const translating = (transQuestion) => {
            const transData = transQuestion;
            setTranslatedText(transData);
            cookie.save(text, transQuestion, { path: "/" })
        }
        googleTranslate.translate(text, "hi", function (err, translation) {
            let transQuestion = translation.translatedText;
            translating(transQuestion);
        });
    }
    return (
        <div className="container">
            <div className="undo-redo div-flex">
                <div className="undo-button">
                    <button disabled={undoToggle} className="button-all button-width" onClick={handleUndo}>
                        <svg id="Layer_1" version="1.1" viewBox="0 0 512 512">
                            <path d="M447.9,368.2c0-16.8,3.6-83.1-48.7-135.7c-35.2-35.4-80.3-53.4-143.3-56.2V96L64,224l192,128v-79.8   c40,1.1,62.4,9.1,86.7,20c30.9,13.8,55.3,44,75.8,76.6l19.2,31.2H448C448,389.9,447.9,377.1,447.9,368.2z" />
                        </svg>
                    </button>
                </div>
                <div className="redo-button">
                    <button disabled={redoToggle} className="button-all button-width" onClick={handleRedo}>
                        <svg id="Layer_1" version="1.1" viewBox="0 0 512 512" >
                            <g>
                                <path d="M64,400h10.3l19.2-31.2c20.5-32.7,44.9-62.8,75.8-76.6c24.4-10.9,46.7-18.9,86.7-20V352l192-128L256,96v80.3   c-63,2.8-108.1,20.7-143.3,56.2c-52.3,52.7-48.7,119-48.7,135.7C64.1,377.1,64,389.9,64,400z" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="text-area">
                <textarea placeholder="Enter text..." className="input-area" onChange={handleData} type='text' value={text} autoFocus></textarea>
                <textarea placeholder="Translated Data..." className="input-area" type='text' value={translatedText} readOnly></textarea>
                <div className="count">
                    <span className="textLength">Length: {textLength}</span>
                    <span className="charLength">Char Length: {textCharLength}</span>
                </div>

            </div>
            <div className="div-flex holderButtons">
                <div className="reset">
                    <button className="button-all reset-button" disabled={false} onClick={handleReset}>Reset</button>
                </div>
                <div className="save-button">
                    <button className="button-all saveDraft-button" onClick={handleDraft}>Save Drafts</button>
                </div>
                <div className="save-button">
                    <button className="button-all translate-button" disabled={submitToggle} onClick={handleTranslation}>Translate</button>
                </div>
                <div>
                    <button className="button-all sumbit-button" disabled={submitToggle} onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    )
}
