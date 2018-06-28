import React from 'react';
import './form.css';
import axios from 'axios'
axios.get('/data/db.json');
/* eslint-disable import/first */
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
require("moment/locale/mn");
// import {Render} from './Render'
export default class Order extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name: '',
            number:'',
            hall: 0,
            selected_date: moment().format("YYYY-MM-DD"),
            selected_startTime: moment().format("HH:mm"),
            selected_endTime: moment().format("HH:mm"),
            calendarData: [],
            // fields: {},
            // errors: {}
        };
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeStartTime= this.handleChangeStartTime.bind(this)
        this.handleChangeEndTime= this.handleChangeEndTime.bind(this)
        // this.contactSubmit = this.contactSubmit.bind(this);
    }
    
    fetchData(){
        axios.get(`http://localhost:3000/data`).then(response => {
            this.setState({ data: response.data });
        }); 
    }
    componentWillMount(){
        this.fetchData();
    }
    getFilteredDates = () => {
        var calendarData = this.state.data.filter((d) => {
            return d.selected_date === this.state.selected_date && d.hall === this.state.hall
        });
        this.setState({calendarData: calendarData});
    }
    onChange = (e, key) =>{
        this.setState({
            [key]: e.target.value,
        }, () => {
                if(key === "hall") {
                    this.getFilteredDates();
            }
        }
    )}
    isBooked(data, value){
        if(data !== undefined && data.length > 0){
            for (var i = 0; i < data.length; i++) { 
                if(data[i].selected_startTime <= value && data[i].selected_endTime >= value){
                    return true;
                }
            } 
        }
        return false;
    }

    handleChange(date){
        this.setState({
            selected_date: date.format("YYYY-MM-DD"),
        }, () => {
                this.getFilteredDates();
        });
    }
    handleChangeStartTime(a){
        this.setState({
            selected_startTime: moment(a).format("HH:mm"),
        });
    }
    handleChangeEndTime(b){
        this.setState({
            selected_endTime: moment(b).format("HH:mm"),
        });
    }
    //write json
    handleClick(){
        axios.post('http://localhost:3000/data', {
            name: this.state.name, 
            number: this.state.number,  
            hall: this.state.hall , 
            selected_date: this.state.selected_date, 
            selected_startTime: this.state.selected_startTime, 
            selected_endTime: this.state.selected_endTime})
            .then(response => this.fetchData())
    }    
    render(){
        var times =["08:00", "08:30", "09:00", "09:30" , "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
                    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
                    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", 
                    "23:00", "23:30"]
        return(
            <div className="App">
                <div className="container" >
                <div className="row">
                    <h3 className="text-center">Заал захиалга</h3>
                    <div className="col-sm-6">
                    <form className="form">
                        <div className="form-group row">
                            <label className="col-sm-2">Нэр</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" onChange={(e) => {this.onChange(e, "name")}} id="name" placeholder="Нэр"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2">Утасны дугаар</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" onChange={(e) => {this.onChange(e, "number")}} placeholder="Утасны дугаар"/>
                                </div>
                        </div>
                        <div className="form-group row">
                        <label className="col-sm-2 ">Заалууд</label>
                            <div className="col-sm-5">
                                <select className="form-control" id="hall" key="hall" onChange={(e) => {this.onChange(e, "hall")}}>
                                    <option selected value="0">Заалууд</option>
                                    <option value="1">Заал-1</option>
                                    <option value="2">Заал-2</option>
                                    <option value="3">Заал-3</option>
                                </select>
                            </div>
                            <div className="col-sm-5" onChange={(e) => {this.onChange(e, "hall")}}>
                                <DatePicker className="form-control"
                                    selected ={moment(this.state.selected_date, "YYYY-MM-DD")}
                                    onChange={this.handleChange}
                                    dateFormat="L"
                                    timeCaption="time"
                                    placeholderText="Өдөрөө сонгоно уу."
                                />  
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2">Цаг</label>
                            <div className="col-sm-5">
                                <DatePicker className="form-control"
                                    selected={moment(this.state.selected_startTime, "HH:mm")}
                                    onChange={this.handleChangeStartTime}   
                                    showTimeSelect
                                    showTimeSelectOnly
                                    minTime={moment().hours(8).minutes(0)}
                                    maxTime={moment().hours(23).minutes(30)}
                                    timeIntervals={30}
                                    dateFormat="LT"
                                    timeCaption="Time"
                                />
                            </div>
                            <div className="col-sm-5">
                                <DatePicker className="form-control"
                                    selected={moment(this.state.selected_endTime, "HH:mm")}
                                    onChange={this.handleChangeEndTime}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    minTime={moment().hours(8).minutes(0)}
                                    maxTime={moment().hours(23).minutes(30)}
                                    timeIntervals={30}
                                    dateFormat="LT"
                                    timeCaption="Time"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="text-center"  >
                            <button type="submit" onClick={this.handleClick} className="btn btn-primary">Захиалах</button>
                            </div>
                        </div>
                   
                    </form>
                    </div>
                    <p className="text-center">ЗАХИАЛГЫН ТӨЛӨВ</p>
                    <div className="col-sm-6">
                    
                    <div className="form-group row">
                            <div className="col-sm-12">
                                <div className="form-group row">
                                    <table className="table table-condensed table-hover table-bordered">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th className="header" scope="col" style={{textalign: 'center'}}>{moment(this.state.selected_date).locale("mn").format('dddd')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                times.map((value, index) => {
                                                    return (
                                                        <tr height= "20">
                                                                <td>{
                                                                        index%2 === 0 && value
                                                                    }
                                                                </td>
                                                                {
                                                                    this.isBooked(this.state.calendarData, value) ? <td style={{backgroundColor: 'blue'}}></td> : <td></td>
                                                                }
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <pre style={{width:"600px"}}>
                        {JSON.stringify(this.state)}
                    </pre> */}
                </div>
                </div>
            </div>
        );
    }
}
