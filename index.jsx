import React from 'react';
import MaskedInput from 'react-maskedinput';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fio: '',
            email: '',
            phone: '',
            errorFields: [],
            status: '',
            reason: ''
        }
        window.MyForm = this;
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.validate = this.validate.bind(this);
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    getData() {
        let data = {
            fio: this.inputFio.value,
            email: this.inputEmail.value,
            phone: this.inputPhone.props.value,
        }
        return data;
    }
    setData(data) {
        this.setState({
            fio: data.fio,
            email: data.email,
            phone: data.phone,
        });
    }
    validate() {
        let {fio, email, phone} = this.state;
        let isValid = false,
            errorFields = [];
        if ( !fio.match(/^([A-zА-яЁё]+\s[A-zА-яЁё]+){2}$/) ) errorFields.push('fio');
        if ( !email.match(/^[a-zA-Z0-9.-]+@(yandex.(ru|com|ua|kz|by)|ya.ru)$/) ) errorFields.push('email');
        let str = phone.match(/\d+/g, '')+'',
            s = str.split(',').join(''),
            phoneNumberSum = 0;
        for ( let item of s ) {
            phoneNumberSum += Number(item);
        }
        if ( isNaN(phoneNumberSum) || phone.includes('_') || phoneNumberSum > 30 ) errorFields.push('phone');
        if ( errorFields.length === 0 ) isValid = true;
        return {
            isValid,
            errorFields
        }
    }
    submit() {
        let validate = this.validate();
        this.setState({errorFields: validate.errorFields})
        if ( validate.isValid ) {
            this.inputSubmit.setAttribute('disabled', 'disabled');
            this.sendRequest(this.formData.action);
        }
    }
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    sendRequest(url){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onload = () => {
            if ( xhr.status === 200 ) {
                let json = JSON.parse(xhr.responseText);
                this.setState({status: json.status, reason: json.reason});
                if ( json.status==="progress" ) {
                    setTimeout( () => { this.sendRequest(url) } , Number(json.timeout) );
                }
            } else {
                console.error();
            }
        };
    }
    fioKeyUp(e) {
        e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Za-яА-Я\s@]+/, '');
    }

    render() {
        let { errorFields } = this.state;

        const resultContainer = (
            this.state.status === 'success' ?
                <div className="result-container alert alert-success">
                    <strong>Success</strong>
                </div> :
                this.state.status === 'error' ?
                    <div className="result-container alert alert-danger">
                        <strong>Error. Reason:{this.state.reason}</strong>
                    </div> :
                    this.state.status === 'progress' ?
                        <div className="result-container alert alert-warning">
                            <strong>In progress..</strong>
                        </div> : ''
        );

        return (
            <form className="col-sm-3 panel" action="progress.json" onSubmit={this.submit} ref={ form =>this.formData = form }>
                {resultContainer}
                <div className="form-group">
                    <label>ФИО</label>
                    <input
                        type="text"
                        name="fio"
                        className={"form-control "+(errorFields.includes('fio')?'error':'')}
                        placeholder="Введите ФИО"
                        value={this.state.fio}
                        onChange={this.handleChange}
                        onKeyUp={this.fioKeyUp}
                        ref={ input => this.inputFio = input }/>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        className={"form-control "+(errorFields.includes('email')?'error':'')}
                        placeholder="Ввведите почту"
                        value={this.state.email}
                        onChange={this.handleChange}
                        ref={ input => this.inputEmail = input }/>
                </div>
                <div className="form-group">
                    <label>Телефон</label>
                    <MaskedInput
                        mask="+7(111)111-11-11"
                        type="text"
                        name="phone"
                        className={"form-control "+(errorFields.includes('phone')?'error':'')}
                        placeholder="Введите номер"
                        value={this.state.phone}
                        onChange={this.handleChange}
                        ref={ input => this.inputPhone = input }/>
                </div>
                <input type="submit"
                       id="submitButton"
                       value="Submit"
                       className="btn btn-primary"
                       ref={ input => this.inputSubmit = input }/>
            </form>
        );
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
