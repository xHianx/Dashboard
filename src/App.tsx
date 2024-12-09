import './App.css'
import Grid from '@mui/material/Grid2'
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import { useEffect, useState } from 'react';
import Item from './interface/item';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const request = async () => {
      let API_KEY = "3f3a46be5b39afdf7737f3cc150923cb";
      let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
      let savedTextXML = await response.text();

      // XML Parser
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      let dataToIndicators: Indicator[] = [];

      let name = xml.getElementsByTagName("name")[0].innerHTML || "";
      dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name });

      let location = xml.getElementsByTagName("location")[1];

      let latitude = location.getAttribute("latitude") || "";
      dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude });

      let longitude = location.getAttribute("longitude") || "";
      dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude });

      let altitude = location.getAttribute("altitude") || "";
      dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude });

      console.log(dataToIndicators);
      setIndicators(dataToIndicators);

      // Análisis del XML y almacenamiento de los primeros 6 objetos
      const times = xml.getElementsByTagName("time");
      let dataToItems: Item[] = [];
      for (let i = 0; i < times.length && dataToItems.length < 6; i++) {
        const time = times[i];
        const dateStart = time.getAttribute("from") || "";
        const dateEnd = time.getAttribute("to") || "";
        const precipitation = time.getElementsByTagName("precipitation")[0].getAttribute("probability") || "";
        const humidity = time.getElementsByTagName("humidity")[0].getAttribute("value") || "";
        const clouds = time.getElementsByTagName("clouds")[0].getAttribute("value") || "";

        dataToItems.push({
          dateStart,
          dateEnd,
          precipitation,
          humidity,
          clouds,
        });
      }
      setItems(dataToItems);
    };

    request();
  }, []); // Asegúrate de que el segundo argumento del useEffect sea un arreglo vacío para que se ejecute una sola vez

  const renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather
          title={indicator["title"]}
          subtitle={indicator["subtitle"]}
          value={indicator["value"]}
        />
      </Grid>
    ));
  };

  return (
    <Grid container spacing={5}>
      {renderIndicators()}
      <Grid size={{ xs: 12, xl: 8 }}></Grid>

      {/* Grid Anidado */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 3 }}>
          <ControlWeather />
        </Grid>
        <Grid size={{ xs: 12, xl: 9 }}>
          <TableWeather itemsIn={items} />
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid size={{ xs: 12, xl: 4 }}>
        <LineChartWeather />
      </Grid>
    </Grid>
  );
}

export default App;