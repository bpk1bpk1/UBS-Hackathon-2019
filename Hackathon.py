import matplotlib
matplotlib.use('TkAgg')
import pandas as pd
import json
from pandas import DataFrame
from pandas import Series
from pandas import concat
from pandas import read_csv
from pandas import datetime
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from math import sqrt
from matplotlib import pyplot
from numpy import array


# An object that it is going to be used to send the frontend a json object with country and the carbon emissions by year
class PresentData:
    def __init__(self,country,values):
        self.country = country # String to indicate country name.
        self.yearCarbonEmissions = values # Dictionary with key:year and value: carbon emissions.

    def print(self):
        print(self.country)
        print(self.yearCarbonEmissions)


# Reading the data set to get all the carbon emission values from 1964 to 2019.
def reading_present_dataset():
    df = pd.read_csv('Data.csv', index_col='Country Name')
    df = df.T # Transforming the data set to making country names as columns
    data_frame = pd.DataFrame(df)
    current_data_frame = data_frame.iloc[7:]
    current_data_frame = current_data_frame.iloc[:51]
    #print(current_data_frame.tail(10))
    current_data_frame.fillna(0, inplace=True) # All the country with no carbon emissions are zero.
    number = 1967
    year = []
    for i in range(0,51):
        number += 1
        year.append(number)
    current_data_frame['Year'] = year # Adding the year as a column to use and not using as an index.
    #print(current_data_frame.columns.values)
    return current_data_frame


def loading_json_object(df):
    listOfObjects = []
    column_values = list(df.columns.values)
    #column_values = ['India']
    for i in column_values:
        present_data_dictionary = {}
        countryRows = df[i]
        nameOfCountry = i
        year = 2018
        for countryRow in countryRows:
            year += 1
            present_data_dictionary[year] = countryRow
        countryDataObject = PresentData(nameOfCountry, present_data_dictionary)
        listOfObjects.append(countryDataObject)
    return listOfObjects



def loading_predicted_object(df):
    listOfObjects = []
    column_values = ['country', 'yearCarbonEmissions']
    nameOfCountry = 'United States'
    columns = df['Invested Result']
    present_data_dictionary = {}
    year = 2018
    for i in columns:
        year += 1
        present_data_dictionary[year] = i

    countryDataObject = PresentData(nameOfCountry, present_data_dictionary)
    listOfObjects.append(countryDataObject)
    return listOfObjects

# Writing the country objects to a json file from the present data set.
def writing_current_data_json_file(currentJsonData):
    with open('currentData.json', 'w') as json_file:
        json_file.write('[')
        for data in currentJsonData:
            json_file.write(',')
            json.dump(data.__dict__, json_file)
        json_file.write(']')

def writing_investment_data_json_file(investedJsonData):
    with open('redJsonData.json', 'w') as json_file:
        json_file.write('[')
        i = 1
        for data in investedJsonData:
            if i != 1:
                json_file.write(',')
            i += 1
            json.dump(data.__dict__, json_file)
        json_file.write(']')

# Creating the Dataset chosen according to countries for all the years and the financial products chosen in the UI
def creating_dataframe_UI_options(country):
    gas_emissions = pd.read_csv('f-gas-emissions.csv')
    coal_emissions = pd.read_csv('f-coal-emissions.csv')
    hydropower_consumption = pd.read_csv('f-hydropower-consumption.csv')
    oil_consumption = pd.read_csv('f-oil-consumptions.csv')
    solarpower_consumption = pd.read_csv('f-solarpower-consumptions.csv')
    dataframe_model = pd.DataFrame()
    dataframe_model['Year'] = list(dataframe['Year'])
    dataframe_model['Gas Emissions'] = gas_emissions[country]
    dataframe_model['Coal Emissions'] = coal_emissions[country]
    dataframe_model['Hydropower'] = hydropower_consumption[country]
    dataframe_model['Solarpower'] = solarpower_consumption[country]
    dataframe_model['Oil Power'] = oil_consumption[country]
    dataframe_model['Result'] = list(dataframe[country])
    dataframe_model.set_index('Year', inplace=True)
    dataframe_model.to_csv('Model.csv', sep=',')


# This code for the model building has been taken over from Jason Brownlee.
# https://machinelearningmastery.com/multi-step-time-series-forecasting-long-short-term-memory-networks-python/
def LSTM_model():
    # Date-Time parsing function for loading the Data Set
    def parser(x):
        return datetime.strptime(x, '%Y')

    # Convert Time Series into Supervised Learning Problem
    def series_to_supervised(data, n_in=1, n_out=1, dropnan=True):
        n_vars = 1 if type(data) is list else data.shape[1]
        df = DataFrame(data)
        cols, names = list(), list()
        # input sequence (t-n, ... t-1)
        for i in range(n_in, 0, -1):
            cols.append(df.shift(i))
            names += [('var%d(t-%d)' % (j + 1, i)) for j in range(n_vars)]
        # forecast sequence (t, t+1, ... t+n)
        for i in range(0, n_out):
            cols.append(df.shift(-i))
            if i == 0:
                names += [('var%d(t)' % (j + 1)) for j in range(n_vars)]
            else:
                names += [('var%d(t+%d)' % (j + 1, i)) for j in range(n_vars)]
        # put it all together
        agg = concat(cols, axis=1)
        agg.columns = names
        # drop rows with NaN values
        if dropnan:
            agg.dropna(inplace=True)
        return agg

    # create a differenced series
    def difference(dataset, interval=1):
        diff = list()
        for i in range(interval, len(dataset)):
            value = dataset[i] - dataset[i - interval]
            diff.append(value)
        return Series(diff)

    # transform series into train and test sets for supervised learning
    def prepare_data(series, n_test, n_lag, n_seq):
        # extract raw values
        raw_values = series.values
        # transform data to be stationary
        diff_series = difference(raw_values, 1)
        diff_values = diff_series.values
        diff_values = diff_values.reshape(len(diff_values), 1)
        # rescale values to -1, 1
        scaler = MinMaxScaler(feature_range=(-1, 1))
        scaled_values = scaler.fit_transform(diff_values)
        scaled_values = scaled_values.reshape(len(scaled_values), 1)
        # transform into supervised learning problem X, y
        supervised = series_to_supervised(scaled_values, n_lag, n_seq)
        supervised_values = supervised.values
        # split into train and test sets
        train, test = supervised_values[0:-n_test], supervised_values[-n_test:]
        return scaler, train, test

    # fit an LSTM network to training data
    def fit_lstm(train, n_lag, n_seq, n_batch, nb_epoch, n_neurons):
        # reshape training into [samples, timesteps, features]
        X, y = train[:, 0:n_lag], train[:, n_lag:]
        X = X.reshape(X.shape[0], 1, X.shape[1])
        # design network
        model = Sequential()
        model.add(LSTM(n_neurons, batch_input_shape=(n_batch, X.shape[1], X.shape[2]), stateful=True))
        model.add(Dense(y.shape[1]))
        model.compile(loss='mean_squared_error', optimizer='adam')
        # fit network
        for i in range(nb_epoch):
            model.fit(X, y, epochs=1, batch_size=n_batch, verbose=0, shuffle=False)
            model.reset_states()
        return model

    # make one forecast with an LSTM,
    def forecast_lstm(model, X, n_batch):
        # reshape input pattern to [samples, timesteps, features]
        X = X.reshape(1, 1, len(X))
        # make forecast
        forecast = model.predict(X, batch_size=n_batch)
        # convert to array
        return [x for x in forecast[0, :]]

    # Evaluate the persistence model
    def make_forecasts(model, n_batch, train, test, n_lag, n_seq):
        forecasts = list()
        for i in range(len(test)):
            X, y = test[i, 0:n_lag], test[i, n_lag:]
            # make forecast
            forecast = forecast_lstm(model, X, n_batch)
            # store the forecast
            forecasts.append(forecast)
        return forecasts

    # Invert differenced forecast
    def inverse_difference(last_ob, forecast):
        # invert first forecast
        inverted = list()
        inverted.append(forecast[0] + last_ob)
        # propagate difference forecast using inverted first value
        for i in range(1, len(forecast)):
            inverted.append(forecast[i] + inverted[i - 1])
        return inverted

    # Inverse data transform on forecasts
    def inverse_transform(series, forecasts, scaler, n_test):
        inverted = list()
        for i in range(len(forecasts)):
            # create array from forecast
            forecast = array(forecasts[i])
            forecast = forecast.reshape(1, len(forecast))
            # invert scaling
            inv_scale = scaler.inverse_transform(forecast)
            inv_scale = inv_scale[0, :]
            # invert differencing
            index = len(series) - n_test + i - 1
            last_ob = series.values[index]
            inv_diff = inverse_difference(last_ob, inv_scale)
            # store
            inverted.append(inv_diff)
        return inverted

    # Evaluate the RMSE for each forecast time step
    def evaluate_forecasts(test, forecasts, n_lag, n_seq):
        for i in range(n_seq):
            actual = [row[i] for row in test]
            predicted = [forecast[i] for forecast in forecasts]
            rmse = sqrt(mean_squared_error(actual, predicted))
            print('t+%d RMSE: %f' % ((i + 1), rmse))

    # Plot the forecasts in the context of the original Data Set
    def plot_forecasts(series, forecasts, n_test):
        # plot the entire dataset in blue
        pyplot.plot(series.values)
        # plot the forecasts in red
        for i in range(len(forecasts)):
            off_s = len(series) - n_test + i - 1
            off_e = off_s + len(forecasts[i]) + 1
            xaxis = [x for x in range(off_s, off_e)]
            yaxis = [series.values[off_s]] + forecasts[i]
            pyplot.plot(xaxis, yaxis, color='red')
        # show the plot
        pyplot.show()

    def investment_products_translations(cost): # Cost Per Unit ($ in millions per terawatt hour)
        costDictionary = {'Coal': 0.175, 'Hydro': 10000, 'Solar': 0.5, 'Oil':1, 'Gas':1}
        additions = {'Coal Emissions': costDictionary['Coal']*cost, 'Hydropower': costDictionary['Hydro']*cost,
                     'Solarpower': costDictionary['Solar']*cost, 'Gas Emissions': costDictionary['Gas']*cost,
                     'Oil Power': costDictionary['Oil']*cost, 'Year':'2019-06-29'}



    def append_investments(series):
        cost = 500000000 #  Using 500 million USD as the investment for all the products
        additive_values = investment_products_translations(cost)
        series = series.append(
            {'Gas Emissions': 25.82 + additive_values['Gas Emissions'], 'Coal Emissions': 18.84 + additive_values['Coal Emissions'],
             'Hydropower': 5000000 + additive_values['Hydropower'],
             'Solarpower': 250 + additive_values['Solarpower'],
             'Oil Power': 31.3 + additive_values['Oil Power'], 'Year': '2018-01-01'}, ignore_index=True)
        return series

    # Load Data Set
    series = read_csv('Model.csv', header=0, parse_dates=[0], index_col=0, squeeze=True, date_parser=parser)
    cost = False
    if(cost == True):
        training_data = append_investments(series)
    dataframe_model = pd.DataFrame()
    columns = ['Gas Emissions', 'Coal Emissions', 'Hydropower', 'Solarpower', 'Oil Power', 'Result']
    for column in columns:
        df = series[column]
        # configure
        n_lag = 1
        n_seq = 30
        n_test = 1
        n_epochs = 1500
        n_batch = 1
        n_neurons = 1
        # prepare data
        scaler, train, test = prepare_data(df, n_test, n_lag, n_seq)
        # fit model
        model = fit_lstm(train, n_lag, n_seq, n_batch, n_epochs, n_neurons)
        # make forecasts
        forecasts = make_forecasts(model, n_batch, train, test, n_lag, n_seq)
        # inverse transform forecasts and test
        forecasts = inverse_transform(df, forecasts, scaler, n_test + 2)
        for i in forecasts:
            columnName = 'Invested' + ' ' + column
            dataframe_model[columnName] = i
        actual = [row[n_lag:] for row in test]
        actual = inverse_transform(df, actual, scaler, n_test + 2)
        # evaluate forecasts
        evaluate_forecasts(actual, forecasts, n_lag, n_seq)
        # plot forecasts
        # plot_forecasts(df, forecasts, n_test + 2)
    year = 2019
    years = []
    for i in range(0, 30):
        year += 1
        years.append(year)
    #print(years)
    dataframe_model['Year'] = years
    #print(dataframe_model.head(30))
    dataframe_model.to_csv('Predicted_Model.csv', sep=',')

# Main Function
dataframe = reading_present_dataset()
currentJsonData = loading_json_object(dataframe)
writing_current_data_json_file(currentJsonData)
investedJsonData = loading_predicted_object(pd.read_csv('Red_Invested_Model.csv'))
writing_investment_data_json_file(investedJsonData)
countries = ['China', 'United States', 'India', 'Indonesia', 'Russia', 'Brazil', 'Japan', 'Canada', 'Germany', 'South Korea']
country = 'United States'
creating_dataframe_UI_options(country)
LSTM_model() # Building the model and outputting it to a csv to provide files.
# Model Building for Carbon Emissions  [LSTM Model [Recurrent Continual Networks]]

