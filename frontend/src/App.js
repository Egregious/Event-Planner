import React, { Component} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import CalendarView from './containers/CalendarView'
import Event from './containers/Event'
import Profile from './containers/Profile'

import Login from './components/Login'
import Signup from './components/Signup'
import CreateEvent from "./components/CreateEvent"

const ProfileAPI = "http://localhost:3000/profiles"


class App extends Component {

    state = {
        previewEvents: {},

        profileId: 0,            // sets state to current user's profile
        eventId: 0,
        nickname: "",
        username: "",

        modalShow: false,
        date: ""                 // maybe need current date
    }

    componentDidMount() {           // make dynamic with auth
        fetch(ProfileAPI)
            .then(r => r.json())
            .then(r => this.setState({
                profileId: r[0].id,
                nickname: r[0] == null ? "null" : r[0].nickname,
                username: r[0] == null ? "null" : r[0].user.username,
                previewEvents: this.formatEvents(r[0].events)
        }))
    }

    formatEvents(r) {

        return r.map(appointment => {
            const {id, title, start, end} = appointment

            let startTime = new Date(start)
            let endTime = new Date(end)

            return {
                id, 
                title, 
                start: startTime,
                end: endTime, 
                extendedProps: {...appointment}
            }
        })
    }

    updateModalShow = (bool) => {
        this.setState({modalShow: bool})
        console.log("updateModalShow was clicked")
    }

    handleEventDrop = (e) => {
        console.log("I moved something")
        console.log(e)
        console.log(e.event.extendedProps.title)
        console.log(e.event.extendedProps.id)
    }

    updateEventId = (e) => {this.setState({eventId: e})}


    render () {

        return (
        <BrowserRouter>
            <div className="App">

            <Switch>
                <Route path='/' exact><Login /></Route>

                <Route path='/signup' component={Signup}/>

                <Route path='/calendar'>
                    <CalendarView 
                        previewEvents={this.state.previewEvents}
                        modalShow={this.state.modalShow}
                        profileId={this.state.profileId}
                        updateModalShow={this.updateModalShow}
                        handleEventDrop={this.handleEventDrop}
                        updateEventId={this.updateEventId}
                    />
                </Route>

                <Route path='/events/:id'>
                    <Event 
                        eventObj={this.state.previewEvents}
                    />
                </Route>

                <Route path='/form'>
                    <CreateEvent
                        profileId={this.state.profileId}
                        nickname={this.state.nickname}
                    />
                </Route>

                <Route path='/profile'>
                    <Profile 
                        profileId={this.state.profileId}
                    />
                </Route>

            </Switch>

            </div>
        </BrowserRouter>
        );
    }
}

export default App;
