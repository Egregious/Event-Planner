import React, { Component, createRef} from 'react';
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

    // constructor(props) {
    //     super(props);
    //     this.calendarRef = createRef();
    // }

    state = {
        previewEvents: {},
        filteredEvent: {},
        profileObj: {},

        profileId: 0,            // sets state to current user's profile
        eventId: 0,              // sets state to selected event id
        nickname: "",
        username: "",

        modalShow: false,
        isUpdate: false,
        date: ""                 // maybe need current date
    }


    componentDidMount() {        // make dynamic with auth
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

    reFormatEvents() {

        let reFormat = this.state.previewEvents

        return reFormat.map(appointment => {
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

    // componentDidUpdate(prevProps) {
    //     console.log("component did update fired")
    //     console.log(prevProps)
    //     const { view: prevView } = prevProps;
    //     const { view } = this.props;
    
    //     if (prevView !== view) {
    //       this.changeView(view);
    //     }
    //     console.log(view)
    // }

    // changeView = view => {
    //     const API = this.getApi();
    
    //     API && API.changeView(view);
    // };

    // getApi = () => {
    //     const { current: calendarDom } = this.calendarRef;
    
    //     return calendarDom ? calendarDom.getApi() : null;
    // };

    updateAddEvent = (e) => {this.setState({ previewEvents: [...this.state.previewEvents, e] }, () => {
        this.formatEvents([...this.state.previewEvents, e])
        // debugger
    })}

    updateRemoveEvent = (e) => {this.setState({ previewEvents: this.state.previewEvents.filter(previewEvents => previewEvents.id !== e )})}

    updateEventId = (e) => {this.setState({ eventId: e })}

    updateModalShow = (bool) => {
        this.setState({modalShow: bool})
        console.log("updateModalShow was clicked")
    }

    filterEvents = (e) => {this.setState({ filteredEvent: e})}

    isUpdate = () => {
        this.setState({ isUpdate: !this.state.isUpdate})
    }
   

    render () {

        // const { view, ...others } = this.props

        return (
        <BrowserRouter>
            <div className="App">

            <Switch>
                <Route path='/' exact><Login /></Route>

                <Route path='/signup' component={Signup}/>

                <Route path='/calendar'>
                    <CalendarView 
                        previewEvents={this.state.previewEvents}
                        nickname={this.state.nickname}
                        profileId={this.state.profileId}
                        modalShow={this.state.modalShow}
                        filterEvents={this.filterEvents}
                        updateModalShow={this.updateModalShow}
                        updateEventId={this.updateEventId}
                        // isUpdate={this.isUpdate}
                        // calendarRef={this.calendarRef}
                        // view={view}
                        view="dayGridMonth"
                    />
                </Route>

                <Route path='/events/:id'>
                    <Event 
                        event={this.state.filteredEvent}
                        updateRemoveEvent={this.updateRemoveEvent}
                        // isUpdat={this.isUpdate}
                    />
                </Route>

                <Route path='/form'>
                    <CreateEvent
                        profileId={this.state.profileId}
                        nickname={this.state.nickname}
                        updateAddEvent={this.updateAddEvent}
                        // isUpdate={this.isUpdate}
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
