import pandas as pd
import json

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
    current_data_frame.fillna(0, inplace=True) # All the country with no carbon emissions are zero.
    number = 1963
    year = []
    for i in range(0,56):
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
        year = 1963
        for countryRow in countryRows:
            year += 1
            present_data_dictionary[year] = countryRow
        countryDataObject = PresentData(nameOfCountry, present_data_dictionary)
        listOfObjects.append(countryDataObject)
    return listOfObjects



dataframe = reading_present_dataset()
currentJsonData = loading_json_object(dataframe)
dataframe = reading_present_dataset()
currentJsonData = loading_json_object(dataframe)
string = ','
# Writing the country objects to a json file from the present data set.
with open('currentData.json', 'w') as json_file:
    json_file.write('[')
    for data in currentJsonData:
        json_file.write(',')
        json.dump(data.__dict__, json_file)
    json_file.write(']')

# Model Building for Carbon Emissions  [Predictive Analysis for features to put into the next model]
country = ['China', 'United States', 'India', 'Indonesia', 'Russia', 'Brazil', 'Japan', 'Canada', 'Germany', 'South Korea']
gas_emissions = pd.read_csv('f-gas-emissions.csv')
coal_emissions = pd.read_csv('f-coal-emissions.csv')
hydropower_consumption = pd.read_csv('f-hydropower-consumption.csv')
oil_consumption = pd.read_csv('f-oil-consumptions.csv')
solarpower_consumption = pd.read_csv('f-solarpower-consumptions.csv')
dataframe_model = pd.DataFrame()
dataframe_model['Year'] = list(dataframe['Year'])
dataframe_model['Gas Emissions'] = gas_emissions['United States']
dataframe_model['Coal Emissions'] = coal_emissions['United.States']
dataframe_model['Hydropower'] = hydropower_consumption['United.States']
dataframe_model['Solarpower'] = solarpower_consumption['United.States']
dataframe_model['Oil Power'] = oil_consumption['United.States']
dataframe_model['Result'] = list(dataframe['United States'])
dataframe_model.set_index('Year', inplace=True)