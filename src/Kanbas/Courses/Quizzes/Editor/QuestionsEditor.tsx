import { useDispatch, useSelector } from "react-redux";
import { KanbasState } from "../../../store";
import { IQuestion, selectQuiz, setQuestion } from "../quizzesReducer";
import * as client from "../client";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Select from 'react-select'
import { FaPlus } from "react-icons/fa";
import { HiMagnifyingGlass, HiPlus } from "react-icons/hi2";
import { QuizEditorFooter } from ".";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from 'react-bootstrap/Form';
import { QuestionPreview } from "../QuizPreview";

const WYSIWYG_API_KEY = process.env.REACT_APP_WYSIWYG_API_KEY;
console.log("API KEY: " + WYSIWYG_API_KEY);
const questionTypeOptions = [
    { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
    { value: 'TRUE_FALSE', label: 'True False' },
    { value: 'FILL_IN', label: 'Fill In' }
]

function QuizQuestionsEditor() {
    const { quizId } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [questionNumber, setQuestionNumber] = useState(-1);
    const [showQuestionEditor, setShowQuestionEditor] = useState<boolean>(false);

    useEffect(() => {
        if (quizId) {
            client.getQuizById(quizId).then((q) => {
                dispatch(selectQuiz(q))
                setLoading(false);
            });
        }
    }, []);

    const showToastMessage = (message: string) => {
        toast.error(message);
    };

    const quiz = useSelector((state: KanbasState) =>
        state.quizzesReducer.quiz);
    const question = useSelector((state: KanbasState) =>
        state.quizzesReducer.question);
    const dispatch = useDispatch();

    const handleUpdateQuestion = async () => {
        const updatedQuestion: IQuestion = JSON.parse(JSON.stringify(question));

        // Validate inputs
        if (questionNumber < 0) {
            showToastMessage("Invalid Question Number... Please refresh and try again!");
            return;
        }

        if (updatedQuestion.points < 0) {
            showToastMessage("Points can't be negative!");
            return;
        }

        if (!updatedQuestion.title) {
            showToastMessage("Question must have title!");
            return;
        }

        if (!updatedQuestion.question) {
            showToastMessage("Must ask a question!");
            return;
        }

        if (question.questionType === "MULTIPLE_CHOICE") {
            const multipleChoiceQuestionError = multipleChoiceQuestionIsvalid(updatedQuestion);
            if (multipleChoiceQuestionError !== null) {
                showToastMessage(multipleChoiceQuestionError);
                return;
            }
            updatedQuestion.fillInBlankAnswers = [];
        } else if (question.questionType === "TRUE_FALSE") {
            updatedQuestion.fillInBlankAnswers = [];
            updatedQuestion.mutlipleChoiceQuestionAnswers = [];
        } else if (question.questionType === "FILL_IN") {
            const fillInQuestionError = fillInQuestionIsvalid(updatedQuestion);
            if (fillInQuestionError !== null) {
                showToastMessage(fillInQuestionError);
                return;
            }
            updatedQuestion.mutlipleChoiceQuestionAnswers = [];
        } else {
            showToastMessage("Unrecognized question type!");
            return;
        }

        const updatedQuiz = {
            ...quiz, questions: [
                ...quiz.questions.slice(0, questionNumber),
                updatedQuestion,
                ...quiz.questions.slice(questionNumber + 1)
            ]
        };
        await client.updateQuiz(updatedQuiz);
        dispatch(selectQuiz(updatedQuiz));
        setShowQuestionEditor(false);
    }

    const multipleChoiceQuestionIsvalid = (questionToValidate: IQuestion): string | null => {
        // Validate there is at least 2 answers
        if (questionToValidate.mutlipleChoiceQuestionAnswers.length < 2) {
            return "Must be at least 2 multiple choice answers!";
        }
        // Validate there is 1 and only 1 correct answer
        let correctAnswerCount = 0;
        questionToValidate.mutlipleChoiceQuestionAnswers.forEach((q) => {
            if (q.correct) {
                correctAnswerCount++;
            }
        });

        if (correctAnswerCount !== 1) {
            return "There must be 1 and only 1 correct answer!";
        }
        return null;
    }

    const fillInQuestionIsvalid = (questionToValidate: IQuestion): string | null => {
        // Validate there is at least 1 answer
        if (questionToValidate.fillInBlankAnswers.length < 1) {
            return "Must be at least 1 fill in answer!";
        }
        // Validate each answer has a value
        questionToValidate.fillInBlankAnswers.forEach((a) => {
            if (!a) {
                return "All answers must contains a value!";
            }
        });
        return null;
    }

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    return (
        <>
            <Modal show={showQuestionEditor} size="xl" onHide={() => setShowQuestionEditor(false)}>
                <ToastContainer />

                {!showQuestionEditor ? <p>Error loading question!</p> :
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Editing Question: {question.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body><QuestionEditor /></Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-light p-2 m-2" onClick={() => setShowQuestionEditor(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger p-2 m-2" onClick={() => handleUpdateQuestion()}>
                                Update Question
                            </button>
                        </Modal.Footer>
                    </>
                }
            </Modal>

            <div className="container-fluid mt-2">
                <button type="button" className="btn btn-light btn-sm rounded ps-3 pe-3 border m-1" onClick={() => {
                    dispatch(setQuestion({
                        title: `Question ${quiz.questions.length + 1} Title`,
                        question: "",
                        points: 1,
                        questionType: "MULTIPLE_CHOICE",
                        mutlipleChoiceQuestionAnswers: [],
                        trueFalseAnswer: false,
                        fillInBlankAnswers: []
                    }));
                    setQuestionNumber(quiz.questions.length);
                    setShowQuestionEditor(true);
                }}><FaPlus /> New Question</button>

                <button type="button" disabled className="btn btn-light btn-sm rounded ps-3 pe-3 border m-1"><FaPlus /> New Question Group</button>
                <button type="button" disabled className="btn btn-light btn-sm rounded ps-3 pe-3 border m-1"><HiMagnifyingGlass /> Find Questions</button>
                <br />

                {quiz.questions.map((question, i) =>
                    <>
                        <hr />
                        <QuestionPreview question={question} />
                        <button type="button" className="btn btn-light btn-sm rounded m-3 pl-0 ps-3 pe-3 border" onClick={() => {
                            dispatch(setQuestion(question));
                            setQuestionNumber(i);
                            setShowQuestionEditor(true);
                        }}>Edit</button>
                    </>
                )}

                <QuizEditorFooter isTimeLimit={quiz.timeLimit !== 0} quiz={quiz} />
            </div >
        </>
    );
}
export default QuizQuestionsEditor;

function QuestionEditor() {
    const question = useSelector((state: KanbasState) =>
        state.quizzesReducer.question);
    return (
        <>
            <QuestionHeader />
            {question.questionType === "MULTIPLE_CHOICE" ?
                <MultipleChoiceQuestionEditor /> :
                question.questionType === "TRUE_FALSE" ?
                    <TrueFalseQuestionEditor /> :
                    <FillInQuestionEditor />
            }
        </>
    );
}

function QuestionHeader() {
    const dispatch = useDispatch();
    const question = useSelector((state: KanbasState) =>
        state.quizzesReducer.question);
    if (!question) {
        return <></>;
    }
    const { title, questionType, points } = question;

    return (
        <div className="col-12 d-flex align-items-start p-3">
            <div className="col-3">
                <input value={title}
                    className="form-control mb-2" onChange={(e) => dispatch(setQuestion({ ...question, title: e.target.value }))}
                />
            </div>
            <div className="col-6">
                <Select
                    value={questionTypeOptions.find((option) => option.value === questionType)}
                    options={questionTypeOptions}
                    onChange={(e) => {
                        if (e && (e?.value === "MULTIPLE_CHOICE" || e?.value === "TRUE_FALSE" || e?.value === "FILL_IN")) {
                            dispatch(setQuestion({ ...question, questionType: e?.value }))
                        }
                    }}
                />
            </div>
            <div className="col-2">

            </div>
            <div className="col-1">
                pts: <input type="number" value={points}
                    className="form-control input-sm mb-2" onChange={(e) => dispatch(setQuestion({ ...question, points: parseInt(e.target.value) }))}
                />
            </div>

        </div>
    );
}

function MultipleChoiceQuestionEditor() {
    const dispatch = useDispatch();
    const question = useSelector((state: KanbasState) =>
        state.quizzesReducer.question);

    if (!question) {
        return <></>;
    }

    return (
        <div className="col-12 p-3">
            <div className="col-12">
                <p>Enter your question and multiple answers, then select the one correct answer.</p>
                <h6>Question:</h6>
                <Editor
                    apiKey={WYSIWYG_API_KEY}
                    value={question.question}
                    onEditorChange={(newValue, editor) => dispatch(setQuestion({ ...question, question: newValue }))}
                />
            </div>

            <br />
            <div className="col-12">
                <h6>Answers:</h6>
                {question.mutlipleChoiceQuestionAnswers.map((answer, i) => {
                    return (
                        <div className="col-12 row border m-3">
                            <div className="col-5">
                                <input value={answer.answer}
                                    className="form-control mb-2" onChange={(e) => dispatch(setQuestion({
                                        ...question, mutlipleChoiceQuestionAnswers: [
                                            ...question.mutlipleChoiceQuestionAnswers.slice(0, i),
                                            {
                                                ...question.mutlipleChoiceQuestionAnswers[i],
                                                answer: e.target.value
                                            },
                                            ...question.mutlipleChoiceQuestionAnswers.slice(i + 1)
                                        ]
                                    }))}
                                />
                            </div>
                            <div className="col-5">
                                Check if correct
                                <input type="checkbox" checked={answer.correct} onChange={(e) => dispatch(setQuestion({
                                    ...question, mutlipleChoiceQuestionAnswers: [
                                        ...question.mutlipleChoiceQuestionAnswers.slice(0, i),
                                        {
                                            ...question.mutlipleChoiceQuestionAnswers[i],
                                            correct: !answer.correct
                                        },
                                        ...question.mutlipleChoiceQuestionAnswers.slice(i + 1)
                                    ]
                                }))} />
                            </div>
                            <div className="col-2 text-end">
                                <button type="button" className="btn btn-danger p-2 m-2" onClick={() => dispatch(setQuestion({
                                    ...question, mutlipleChoiceQuestionAnswers: [
                                        ...question.mutlipleChoiceQuestionAnswers.slice(0, i),
                                        ...question.mutlipleChoiceQuestionAnswers.slice(i + 1)
                                    ]
                                }))}>Remove Answer</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="text-end">
                <span className="text-danger" onClick={() => dispatch(setQuestion({ ...question, mutlipleChoiceQuestionAnswers: [...question.mutlipleChoiceQuestionAnswers, { answer: "", correct: false }] }))}><HiPlus /> Add Another Answer</span>
            </div>

        </div >
    );
}

function TrueFalseQuestionEditor() {
    const dispatch = useDispatch();
    const question = useSelector((state: KanbasState) =>
        state.quizzesReducer.question);


    if (!question) {
        return <></>;
    }
    return (
        <>
            <p>Enter your question and multiple answers, then select the one correct answer.</p>
            <h6>Question:</h6>
            <Editor
                apiKey={WYSIWYG_API_KEY}
                value={question.question}
                onEditorChange={(newValue, editor) => dispatch(setQuestion({ ...question, question: newValue }))}
            />

            <br />
            <h6>True or False</h6>
            <Form.Check
                type="radio"
                label="True"
                checked={question.trueFalseAnswer}
                onChange={() => dispatch(setQuestion({ ...question, trueFalseAnswer: true }))}
                inline
            />
            <br />
            <Form.Check
                type="radio"
                label="False"
                checked={!question.trueFalseAnswer}
                onChange={() => dispatch(setQuestion({ ...question, trueFalseAnswer: false }))}
                inline
            />
        </>

    );

}

function FillInQuestionEditor() {
    const dispatch = useDispatch();
    const question = useSelector((state: KanbasState) =>
        state.quizzesReducer.question);

    if (!question) {
        return <></>;
    }
    return (
        <div className="col-12 p-3">
            <div className="col-12">
                <p>Enter your question text, then define all possible correct answers for the blank</p>
                <h6>Question:</h6>
                <Editor
                    apiKey={WYSIWYG_API_KEY}
                    value={question.question}
                    onEditorChange={(newValue, editor) => dispatch(setQuestion({ ...question, question: newValue }))}
                />
            </div>

            <br />
            <div className="col-12">
                <h6>Answers:</h6>
                {question.fillInBlankAnswers.map((answer, i) => {
                    return (
                        <div className="col-12 row border m-3">
                            <div className="col-5">
                                <p>Blank {i + 1} Answer:</p>
                                <input value={answer}
                                    className="form-control mb-2" onChange={(e) => dispatch(setQuestion({
                                        ...question, fillInBlankAnswers: [
                                            ...question.fillInBlankAnswers.slice(0, i),
                                            e.target.value,
                                            ...question.fillInBlankAnswers.slice(i + 1)
                                        ]
                                    }))}
                                />
                            </div>
                            <div className="col-2 text-end">
                                <button type="button" className="btn btn-danger p-2 m-2" onClick={() => dispatch(setQuestion({
                                    ...question, fillInBlankAnswers: [
                                        ...question.fillInBlankAnswers.slice(0, i),
                                        ...question.fillInBlankAnswers.slice(i + 1)
                                    ]
                                }))}>Remove Answer</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="text-end">
                <span className="text-danger" onClick={() => dispatch(setQuestion({ ...question, fillInBlankAnswers: [...question.fillInBlankAnswers, ""] }))}><HiPlus /> Add Another Answer</span>
            </div>

        </div >
    );

}