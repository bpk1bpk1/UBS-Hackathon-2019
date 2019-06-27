import pandas as pd

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