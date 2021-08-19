import React, { useState } from 'react'
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import DateTimePicker from 'react-datetime-picker'

import Navbar from './Navbar'

const EventsAPI = "http://localhost:3000/events/"
const ThumbnailAPI = "http://localhost:3000/thumbnails/"

export default function CreateEvent ({ profileId }) {

    const [startDateTime, setStartDateTime] = useState(null)
    const [endDateTime, setEndDateTime] = useState(null)

    const createEvent = (e) => {
        e.preventDefault()

        let parseStart = new Date(startDateTime)
        let parseEnd = new Date(endDateTime)

        let parseStartDate = `${parseStart.getMonth()+1}/${parseStart.getDate()}/${parseStart.getFullYear()}`
        let parseStartTime = `${parseStart.getHours()}:${parseStart.getMinutes()}`
        let concStartDateTime = `${parseStartDate} ${parseStartTime}`

        let parseEndDate = `${parseEnd.getMonth()+1}/${parseEnd.getDate()}/${parseEnd.getFullYear()}`
        let parseEndTime = `${parseEnd.getHours()}:${parseEnd.getMinutes()}`
        let concEndDateTime = `${parseEndDate} ${parseEndTime}`


        const postObjEvent = {
            title: e.target[0].value,
            description: e.target[1].value,
            start: concStartDateTime,
            end: concEndDateTime,
            profile_id: profileId                  // make dynamic after fixing state-props pass through
        }

        // const postObjThumbnail = {
        //     image: e.target[2].value,
        //     event_id: 1
        // }

        fetch(EventsAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify(postObjEvent)
        })
            .then(res => res.json())
            .then(res => console.log(res))
            .then(console.log("posted new event object!"))
            .catch(() => alert("event post error!"))
            // // implement redirect to Calendar

        // fetch(ThumbnailAPI, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         'Accept': 'application/json'
        //     },
        //     body: JSON.stringify(postObjThumbnail)
        // })
        //     .then(res => res.json())
        //     .then(res => console.log(res))
        //     .catch(() => alert("thumbnail post error!"))
    }


    return (

        <div>
            <Navbar />

            <Form onSubmit={(e) => createEvent(e)} style={{maxWidth: '300px', width: '50%', margin: 'auto'}}>
                <Form.Group className="mb-3" controlId="formBasicTitle">
                    <Form.Label>Event Title</Form.Label>
                    <Form.Control 
                        type="type" 
                        placeholder="Enter an event title" 
                        // onChange={ title => setTitle(title) } 
                        // value={ title } 
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="description" placeholder="Event description" />
                </Form.Group>

                {/* <Form.Group className="mb-3" controlId="formBasicThumbnail">
                    <Form.Label>Thumbnail</Form.Label>
                    <Form.Control type="thumbnail" placeholder="Add an event thumbnail (url)" />
                </Form.Group> */}

                <Form.Group className="mb-3" controlId="formBasicTitle"> 
                    <Form.Label>Start Date</Form.Label>
                    <DateTimePicker
                        onChange={ date => setStartDateTime(date) }
                        value={ startDateTime }
                        DisableClock={ true }
                        minDate={ new Date() }
                        // format={ "mm/dd/yyyy hh:mm"}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicTitle"> 
                    <Form.Label>End Date</Form.Label>
                    <DateTimePicker
                        onChange={ date => setEndDateTime(date) }
                        value={ endDateTime }
                        DisableClock={ true }
                        minDate={ new Date() }
                        // format={ "mm/dd/yyyy hh:mm"}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}