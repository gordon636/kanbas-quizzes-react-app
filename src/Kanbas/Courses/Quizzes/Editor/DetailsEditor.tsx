import { useDispatch, useSelector } from "react-redux";
import { KanbasState } from "../../../store";
import { selectQuiz } from "../quizzesReducer";
import * as client from "../client";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import moment from "moment";
import Select from 'react-select'
import { QuizEditorFooter } from ".";

const quizTypeOptions = [
    { value: 'GRADED_QUIZ', label: 'Graded Quiz' },
    { value: 'PRACTICE_QUIZ', label: 'Practice Quiz' },
    { value: 'GRADED_SURVEY', label: 'Graded Survey' },
    { value: 'UNGRADED_SURVEY', label: 'Ungraded Survey' }
]

const assignmentGroupOptions = [
    { value: 'QUIZZES', label: 'QUIZZES' },
    { value: 'EXAMS', label: 'EXAMS' },
    { value: 'ASSIGNMENTS', label: 'ASSIGNMENTS' },
    { value: 'PROJECT', label: 'PROJECT' }
]


function QuizDetailsEditor() {
    const WYSIWYG_API_KEY = process.env.REACT_APP_WYSIWYG_API_KEY;
    const { courseId, quizId } = useParams();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (quizId) {
            client.getQuizById(quizId).then((quiz) => {
                dispatch(selectQuiz(quiz))
                setLoading(false);
            });
        }
    }, []);

    const dispatch = useDispatch();
    const quiz = useSelector((state: KanbasState) =>
        state.quizzesReducer.quiz);

    const [isTimeLimit, setIsTimeLimit] = useState(quiz.timeLimit !== 0);

    if (isLoading) {
        return <h3>Loading...</h3>;
    }

    return (
        <div className="container-fluid mt-2">
            <input value={quiz.name}
                className="form-control mb-2" onChange={(e) => dispatch(selectQuiz({ ...quiz, name: e.target.value }))}
            />

            <p>Quiz Instructions:</p>
            <Editor
                apiKey={WYSIWYG_API_KEY}
                value={quiz.description}
                onEditorChange={(newValue, editor) => {
                    dispatch(selectQuiz({ ...quiz, description: newValue }))
                }}
            />
            <div className="col-12 d-flex align-items-start p-3">
                <div className="col-3 text-end m-1 ">
                    <p>Quiz Type</p><br />
                    <p>Assignment Group</p>
                </div>
                <div className="col-5 mb-3">
                    <Select
                        value={quizTypeOptions.find((option) => option.value === quiz.quizType)}
                        options={quizTypeOptions}
                        onChange={(e) => dispatch(selectQuiz({ ...quiz, quizType: e?.value }))}
                    /><br />
                    <Select
                        value={assignmentGroupOptions.find((option) => option.value === quiz.assignmentGroup)}
                        options={assignmentGroupOptions}
                        onChange={(e) => dispatch(selectQuiz({ ...quiz, assignmentGroup: e?.value }))}
                    /><br />
                    <strong>Options</strong>
                    <br />
                    <label htmlFor="shuffleAnswers">Shuffle Answers</label>
                    <input type="checkbox" id="shuffleAnswers" checked={quiz.shuffleAnswers} onChange={(e) => dispatch(selectQuiz({ ...quiz, shuffleAnswers: !quiz.shuffleAnswers }))} />
                    <br />

                    <label htmlFor="timeLimit">Time Limit (Minutes)</label>
                    <input type="checkbox" id="timeLimit" checked={isTimeLimit} onChange={() => setIsTimeLimit(!isTimeLimit)} />
                    <input type="number" disabled={!isTimeLimit} value={isTimeLimit ? quiz.timeLimit : ""}
                        className="form-control input-sm mb-2" onChange={(e) => dispatch(selectQuiz({ ...quiz, timeLimit: e.target.value }))}
                    />

                    <div className="border p-1">
                        <label htmlFor="multipleAttempts">Allow Multiple Attempts</label>
                        <input type="checkbox" id="multipleAttempts" checked={quiz.multipleAttempts} onChange={(e) => dispatch(selectQuiz({ ...quiz, multipleAttempts: !quiz.multipleAttempts }))} />
                        <br />

                        <label htmlFor="showCorrectAnswers">Show Correct Answers</label>
                        <input type="checkbox" id="showCorrectAnswers" checked={quiz.showCorrectAnswers} onChange={(e) => dispatch(selectQuiz({ ...quiz, showCorrectAnswers: !quiz.showCorrectAnswers }))} />
                        <br />

                        <label htmlFor="oneQuestionAtATime">One Question at a time</label>
                        <input type="checkbox" id="oneQuestionAtATime" checked={quiz.oneQuestionAtATime} onChange={(e) => dispatch(selectQuiz({ ...quiz, oneQuestionAtATime: !quiz.oneQuestionAtATime }))} />
                        <br />

                        <label htmlFor="webcamRequired">Webcam Required</label>
                        <input type="checkbox" id="webcamRequired" checked={quiz.webcamRequired} onChange={(e) => dispatch(selectQuiz({ ...quiz, webcamRequired: !quiz.webcamRequired }))} />
                        <br />

                        <label htmlFor="lockQuestionsAfterAnswering">Lock Questions After Answering</label>
                        <input type="checkbox" id="lockQuestionsAfterAnswering" checked={quiz.lockQuestionsAfterAnswering} onChange={(e) => dispatch(selectQuiz({ ...quiz, lockQuestionsAfterAnswering: !quiz.lockQuestionsAfterAnswering }))} />
                        <br />
                    </div>

                    <label htmlFor="accessCode">Access Code</label>
                    <input value={quiz.accessCode} id="accessCode"
                        className="form-control mb-2" onChange={(e) => dispatch(selectQuiz({ ...quiz, accessCode: e.target.value }))}
                    />
                </div>

            </div>



            <div className="col-12 d-flex align-items-start p-3">
                <div className="col-1">
                    <p>Assign</p>
                </div>

                <div className="col-6 border p-1">
                    <strong className="m-1">Due</strong>
                    <input type="datetime-local" value={moment(quiz.dueDate).format('YYYY-MM-DD HH:mm:ss')}
                        className="form-control mb-2" onChange={(e) => dispatch(selectQuiz({ ...quiz, dueDate: e.target.value }))} />

                    <div className="col-12 d-flex align-items-start p-3">
                        <div className="col-6 d-flex align-items-start p-3">

                            <strong>Available From</strong><br />
                            <input type="datetime-local" value={moment(quiz.availableDate).format("YYYY-MM-DD HH:mm:ss")}
                                className="form-control mb-2" onChange={(e) => dispatch(selectQuiz({ ...quiz, availableDate: e.target.value }))} />
                        </div>
                        <div className="col-6 d-flex align-items-start p-3">
                            <strong>Available Until</strong><br />
                            <input type="datetime-local" value={moment(quiz.untilDate).format("YYYY-MM-DD HH:mm:ss")}
                                className="form-control mb-2" onChange={(e) => dispatch(selectQuiz({ ...quiz, untilDate: e.target.value }))} />
                        </div>
                    </div>
                </div>
            </div>

            <QuizEditorFooter isTimeLimit={isTimeLimit} quiz={quiz} />
        </div >
    );
}
export default QuizDetailsEditor;