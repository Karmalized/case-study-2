import './App.css';
import React from "react";
import { DataProvider } from './Components/DataContext';
import  FileUploadButton from './Components/FileUploadButton';
import ChartComponent from "./Components/ChartComponent";
import TypeComponent from "./Components/TypeComponent";
import PredictiveChartComponent from './Components/PredictiveChartComponent';
import AdditionalMetrics from './Components/AdditionalMetrics';
import WallClock from './Components/WallClock';

function App() {
  return (
    <div className="App">
      <DataProvider>
      <div className="Dashboard">
        <div className="ParkAnalytics">
          <h1>Park Traffic</h1>
          <ChartComponent/>
        </div>
        <div className="VisitCounts">
          <h1>Visitor Type</h1>
          <TypeComponent/>
        </div>
        <div className="PredictiveTrends">
          <h1>Weather Trends</h1>
          <PredictiveChartComponent/>
        </div>
      </div>
        <div className='BottomComponents'>
          <div className='AdditionalMetrics'>
            <AdditionalMetrics/>
          </div>
          <div className='FileUpload'>
            <FileUploadButton/>
            <h2>Welcome to Draco National Park!</h2>
          </div>
          <div className="wallClock">
            <WallClock/>
          </div>
        </div>
      </DataProvider>
    </div>
  );
}

export default App;
