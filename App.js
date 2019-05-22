import React, {Component} from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import Weather from './Weather';

const API_KEY = "1c6040609dd62a847ede395d2b820d43";

export default class App extends Component {
    state = {
        isLoaded: false,
        error: null,
        temperature: null,
        name: null,
        local: null
    };

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this._getWeather(position.coords.latitude, position.coords.longitude);
            },
            error => {
                this.setState({
                    error: error
                });
            }
        );
    }

    _getWeather = (lat, lon) => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}`)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    temperature: json.main.temp,
                    name: json.weather[0].main,
                    local: json.name,
                    isLoaded: true
                });
                console.log(json);
            });
    };

    render() {
        const {isLoaded, error, temperature, name, local} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                {isLoaded ? (
                    <Weather weatherName={name} localName={local} temp={Math.ceil(temperature - 273.15)}/>
                ) : (
                    <View style={styles.loading}>
                        <Text style={styles.loadingText}>Getting the fucking weather</Text>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    errorText: {
        color: 'red',
        marginBottom: 40
    },
    loading: {
        flex: 1,
        backgroundColor: '#fdf6aa',
        justifyContent: 'flex-end',
        paddingLeft: 25,
    },
    loadingText: {
        fontSize: 38,
        marginBottom: 100,
    }
});
