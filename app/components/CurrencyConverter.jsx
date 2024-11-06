import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Picker, StyleSheet, Switch, Animated, Easing, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [baseCurrency, setBaseCurrency] = useState('USD');
    const [targetCurrency, setTargetCurrency] = useState('EUR');
    const [exchangeRates, setExchangeRates] = useState({});
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [currencies, setCurrencies] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (baseCurrency) {
            fetchExchangeRates();
        }
    }, [baseCurrency]);

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
            const availableCurrencies = Object.keys(response.data.rates);
            setCurrencies(availableCurrencies);
            setExchangeRates(response.data.rates);
        } catch (error) {
            console.error('Error fetching currencies:', error);
        }
    };

    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
            setExchangeRates(response.data.rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

    const convertCurrency = () => {
        const rate = exchangeRates[targetCurrency];
        const result = rate ? (amount * rate).toFixed(2) : 0;
        setConvertedAmount(result);
        fadeIn();
    };

    const fadeIn = () => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    const handleButtonPressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handleButtonPressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const swapCurrencies = () => {
        const temp = baseCurrency;
        setBaseCurrency(targetCurrency);
        setTargetCurrency(temp);
        convertCurrency();
    };

    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#333333' }]}>Currency Converter</Text>
            <TextInput
                style={[styles.input, { backgroundColor: isDarkMode ? '#555555' : '#ffffff' },{ color: isDarkMode ?  '#ffffff':'#333333'}]}
                placeholder="Amount"
                placeholderTextColor={isDarkMode ?'#dddddd' : '#333333' }
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />
            <Picker
                selectedValue={baseCurrency}
                style={[styles.picker,{backgroundColor: isDarkMode ? '#555555' : '#40e0d0' },{color:isDarkMode ? '#ffffff' : '#000000'}]}
                onValueChange={(itemValue) => {
                    setBaseCurrency(itemValue);
                    fetchExchangeRates();
                }}
            >
                {currencies.map((currency) => (
                    <Picker.Item key={currency} label={currency} value={currency} />
                ))}
            </Picker>
            <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
                <Icon name="exchange" size={30} color={isDarkMode ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
            <Picker
                selectedValue={targetCurrency}
                style={[styles.picker,{backgroundColor: isDarkMode ? '#555555' : '#87ceeb' },{color:isDarkMode ? '#ffffff' : '#000000'}]}
                onValueChange={(itemValue) => {
                    setTargetCurrency(itemValue);
                    convertCurrency();
                }}
            >
                {currencies.map((currency) => (
                    <Picker.Item key={currency} label={currency} value={currency} />
                ))}
            </Picker>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity onPressIn={handleButtonPressIn} onPressOut={handleButtonPressOut} onPress={convertCurrency}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Convert</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
            <Animated.Text style={[styles.result, { opacity: fadeAnim, color: isDarkMode ? '#ffffff' : '#333333' }]}>
                Converted Amount: {convertedAmount} {targetCurrency}
            </Animated.Text>
            <View style={styles.switchContainer}>
                <Text style={[styles.switchLabel, { color: isDarkMode ? '#ffffff' : '#333333' }]}>Dark Mode</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={(value) => setIsDarkMode(value)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    lightContainer: {
        backgroundColor: '#ffffff',
    },
    darkContainer: {
        backgroundColor: '#333333',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,  
        borderBottomRightRadius: 10,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        borderBottomLeftRadius: 10,  
        borderBottomRightRadius: 10,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        
       
    },
    swapButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    switchLabel: {
        fontSize: 16,
    },
});

export default CurrencyConverter;
