import React,{useState,useEffect} from 'react';
import './App.css';
import { Card, CardContent, FormControl,MenuItem,Select } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo,setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:34.80746,lng:-40.4796})
  const [mapZoom, setMapZoom] = useState(3)
  const [casesType, setCasesType] = useState("cases")
  const [mapCountries, setMapCountries] = useState([])

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response)=>response.json())
      .then((data)=>{
        setCountryInfo(data)
      })
  },[])

  useEffect(()=>{
    // async task to get countries
    const getCountriesData  = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country, // United States, United Kingdom
            value:country.countryInfo.iso2 //UK, USA, TG
          }
        ))

        const sortedData = sortData(data)
        setTableData(sortedData)
        setCountries(countries)
        setMapCountries(data)
      })
    }

    getCountriesData()
  },[])


  const onCountryChange = async (event) =>{
    const countryCode = event.target.value

    const url = countryCode === 'worldwide'
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data=>{
      setCountry(countryCode)

      // All of the data
      // from the country response
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat,data.countryInfo.long])
      setMapZoom(5)
    })
  }


  console.log("Country info>>>",countryInfo)
  return (
    <div className="app dark-mode">
      
      <div className="app__left">
      <div className="app__header">
        <h1 className="">COVID-19 KPOLA</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }

            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Option two</MenuItem>
            <MenuItem value="worldwide">Option 3</MenuItem>
            <MenuItem value="worldwide">Option 4</MenuItem> */}

          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
          <InfoBox isRed active={casesType==='cases'} onClick={(e)=>setCasesType("cases")} title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} num={1}/>

          <InfoBox active={casesType==='recovered'} onClick={(e)=>setCasesType("recovered")} title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} num={2}/>

          <InfoBox isPurple active={casesType==='deaths'} onClick={(e)=>setCasesType("deaths")} title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} num={3}/>
      </div>

      <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>

          {/* Table */}
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          {/* Graph */}
          <LineGraph  casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
