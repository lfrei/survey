import './CreateSurvey.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import { useHistory } from 'react-router-dom';

function CreateSurvey() {
    const history = useHistory();
    const [survey, setSurvey] = useState({
        title: "",
        description: "",
        creator: "",
        status: "private",
        options: []
    });

    const onChangeSurvey = (e) => {
        const key = e.target.id;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSurvey({ ...survey, [key]: value });
    }

    const onChangeOption = (e) => {
        const key = e.target.id - 1;
        const value = e.target.value;
        setSurvey({ ...survey, options: [...survey.options.slice(0,key), value, ...survey.options.slice(key+1, survey.options.length)]});
    }

    const onAddOption = () => {
        setSurvey({ ...survey, options: [...survey.options, ""]});
    }

    const onRemoveOption = (e) => {
        const key = e.target.id;
        setSurvey({ ...survey, options: [...survey.options.slice(0,key), ...survey.options.slice(key+1, survey.options.length)]});
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (notEnoughOptions()) {
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(survey)
        };

        fetch('http://localhost:3000/survey', requestOptions)
            .then(response => response.json())
            .then(data => history.push('/' + data.id));
    }

    const notEnoughOptions = () => {
        return survey.options.length < 2;
    }

    return (
        <Form onSubmit={onSubmit}>
            <h3 className="title">Create a new survey</h3>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control 
                    type="input" 
                    placeholder="Enter title"
                    id="title"
                    value={survey.title}
                    onChange={onChangeSurvey}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    type="input" 
                    placeholder="Enter description (optional)" 
                    id="description"
                    value={survey.description}
                    onChange={onChangeSurvey}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Creator</Form.Label>
                <Form.Control 
                    type="input" 
                    placeholder="Enter name" 
                    id="creator"
                    value={survey.creator}
                    onChange={onChangeSurvey}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                    id="status"
                    onChange={onChangeSurvey}>
                    <option>private</option>
                    <option>public</option>
                </Form.Select>
            </Form.Group>
    
            {survey.options.map((o, i) => (
                <Form.Group className="mb-3" key={i}>
                    <Form.Label>Option {i+1}</Form.Label>
                    <InputGroup>
                        <Form.Control 
                            type="input" 
                            placeholder="Enter description for option" 
                            id={i+1}
                            value={survey.options[i]}
                            onChange={onChangeOption}
                        />
                        <Button variant="outline-secondary" id={i} onClick={onRemoveOption}>Remove</Button>
                    </InputGroup> 
                </Form.Group>
            ))}

            {notEnoughOptions() && <Alert variant="info">Add more options to create a survey</Alert>}

            <Button variant="outline-secondary" onClick={onAddOption}>
                Add Option
            </Button>
            {' '}
            <Button variant="outline-primary" type="submit">
                Create Survey
            </Button>
        </Form>
    );
}

export default CreateSurvey;
