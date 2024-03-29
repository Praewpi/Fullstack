import { useState, useEffect } from 'react'
import axios from 'axios'
// to run on terminal REACT_APP_API_KEY={key} npm start

const Country = ({ country }) => {
  //api key
  const api_key = process.env.REACT_APP_API_KEY
  const [ weatherData, setWeatherData ] = useState({})
  //https://api.openweathermap.org/data/2.5/weather?
  const weatherUrl = `http://pro.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo[0]}&lon=${country.capitalInfo[1]}&units=metric&appid=${api_key}`
  //const { name, area, capital, capitalInfo, languages, flag } = country;
  useEffect(() => {
    axios
      .get(weatherUrl)
      .then(response => {
        console.log('axios get weather response:', response)
        setWeatherData(response.data)
      })
  }, [])

  return (
     <div>
      <h2>{country.name} {country.flag}</h2>
      <span>Capital: {country.capital}</span><br/>
      <span>Area: {country.area}</span>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} style={{ width: '175px' }} alt="flag"/>


      <h2>Weather in {country.capital}</h2>
      <span>Temperature: {(function() {
        if (Object.keys(weatherData).length !== 0) 
          return weatherData.main.temp
          
        })()
        
      } 
      Celcius</span><br/>
      <img src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}></img><br/>
      <span>Wind: {(function() {
        if (Object.keys(weatherData).length !== 0) 
          return weatherData.wind.speed
        })()
      } m/s</span>
    </div>
  )
}

const Countries = ({ countries, setSearch }) => {
  const showCountry = name => {
    return function(e) {
      e.preventDefault()
      setSearch(name)
    }
  }

  return (
    <ul>
      {countries.map(country => 
        <li key={country.name}>{country.name} <button onClick={showCountry(country.name)}>show</button></li>
      )}
    </ul>
  )
}


// app part
const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const countriesBaseUrl = 'https://restcountries.com/v3.1/all'


  // check axios progression of the execution.
  useEffect(() => {
    console.log('effect')
    axios.get(countriesBaseUrl)
    .then(response => {
      console.log('promise fulfilled, get response:',response)
      setCountries(response.data.map(country => (
        {
          name: country.name.common,
          area: country.area,
          capital: country.capital,
          capitalInfo: country.capitalInfo.latlng,
          languages: country.languages,
          flag: country.flag,
          flags: country.flags
        }
      )
    ))
    })
    .catch((error) => {
      console.log('Error fetching countries:', error);
    })
  },[])


  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue)
   // setCountryFilter(searchValue)
  }


  const countriesToShow = countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase()))
 
  
  const displayCountries = () => {
    if (countriesToShow.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (countriesToShow.length > 1) {
      return <Countries countries={countriesToShow} setSearch={setSearch} />;
    } else if (countriesToShow.length === 1) {
      return <Country country={countriesToShow[0]} />;
    } else {
      return <p>No countries found</p>;
    }
  };

  return (
    <div>
      find countries
      <input value={search} onChange={handleSearch}/>

      {displayCountries()}
    </div>
  )

}
export default App