import * as React from 'react';
import * as d3 from "d3";
import { DataContext } from "./DataContext";
import Select from "react-select";


const ChartComponent = () => {
    const { csvData } = React.useContext(DataContext);

    const options = [
        { value: 'Daily', label: 'Daily' },
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' }
      ];

      function changeParam(selectedOption){
        const width = 400, height = 210, margin = {top: 20, bottom: 30, right: 20, left: 40};
        const svg = d3.select("#visitorLinePlot");
        if(selectedOption == 'Daily'){
            const Daily = Array.from(d3.rollup(csvData, v => d3.sum(v, d => d['NoV']), d => d['date']),([date,NoV]) => ({date, NoV}));
            const xAxis = d3.scaleTime().domain(d3.extent(Daily, d => d.date)).range([margin.left, width - margin.right]);
            const yAxis = d3.scaleLinear().domain([0, d3.max(Daily, d => d.NoV)]).range([height - margin.bottom, margin.top]).nice();
            const newArea = d3.area().curve(d3.curveStep).x(d => xAxis(d['date'])).y0(yAxis(0)).y1(d => yAxis(d['NoV']));
            svg.select(".areaX").transition().duration(2000).call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%b")))
            svg.select(".areaY").transition().duration(2000).call(d3.axisLeft(yAxis))
            svg.select(".areaPlotting").datum(Daily).transition().duration(2000).attr("d", newArea);
        }
        if(selectedOption == 'Weekly'){
            const Weekly = Array.from(d3.rollup(csvData, v => d3.sum(v, d => d['NoV']), d => d3.timeWeek.floor(d['date'])),([date,NoV]) => ({date, NoV}));
            const xAxis = d3.scaleTime().domain(d3.extent(Weekly, d => d.date)).range([margin.left, width - margin.right]);
            const yAxis = d3.scaleLinear().domain([0, d3.max(Weekly, d => d.NoV)]).range([height - margin.bottom, margin.top]).nice();
            const newArea = d3.area().curve(d3.curveStep).x(d => xAxis(d['date'])).y0(yAxis(0)).y1(d => yAxis(d['NoV']));
            svg.select(".areaX").transition().duration(2000).call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%b")))
            svg.select(".areaY").transition().duration(2000).call(d3.axisLeft(yAxis))
            svg.select(".areaPlotting").datum(Weekly).transition().duration(2000).attr("d", newArea);
        }
        if(selectedOption == 'Monthly'){
            const Monthly = Array.from(d3.rollup(csvData, v => d3.sum(v, d => d['NoV']), d => d3.timeMonth.floor(d['date'])),([date,NoV]) => ({date, NoV}));
            const xAxis = d3.scaleTime().domain(d3.extent(Monthly, d => d.date)).range([margin.left, width - margin.right]);
            const yAxis = d3.scaleLinear().domain([0, d3.max(Monthly, d => d.NoV)]).range([height - margin.bottom, margin.top]).nice();
            const newArea = d3.area().curve(d3.curveStep).x(d => xAxis(d['date'])).y0(yAxis(0)).y1(d => yAxis(d['NoV']));
            svg.select(".areaX").transition().duration(2000).call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%b")))
            svg.select(".areaY").transition().duration(2000).call(d3.axisLeft(yAxis))
            svg.select(".areaPlotting").datum(Monthly).transition().duration(2000).attr("d", newArea);
        }
      }

    React.useEffect(() => {
        const width = 400, height = 210, margin = {top: 20, bottom: 30, right: 20, left: 40};
        
        d3.select("#visitorLinePlot").html("");
    
        const svg = d3.select('#visitorLinePlot')
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        
        const grouping = Array.from(d3.rollup(csvData, v => d3.sum(v, d => d['NoV']), d => d['date']),([date,NoV]) => ({date, NoV}));
        console.log(grouping);
        const xAxis = d3.scaleTime().domain(d3.extent(grouping, d => d.date)).range([margin.left, width - margin.right]);

        console.log()

        const yAxis = d3.scaleLinear().domain([0, d3.max(grouping, d => d.NoV)]).range([height - margin.bottom, margin.top]).nice();
        console.log(d3.max(csvData, d => Number(d['NoV'])))
    
        const area = d3.area().curve(d3.curveStep).x(d => xAxis(d['date'])).y0(yAxis(0)).y1(d => yAxis(d['NoV']));
    
        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%b"))).attr("class", "areaX")
    
        svg.append("g").attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yAxis)).attr("class", "areaY")
    
        svg.append("path").datum(grouping).attr("fill", "steelblue").attr("d", area).attr("class", "areaPlotting");
      }, [csvData]);
    
      return (
      <div>
        <div id='buttonContainer'>
            <Select defaultValue={options[0]} options={options} onChange={(timeSet) => changeParam(timeSet.value)} width='25%' />
        </div>
        <div id='visitorLinePlot'></div>
      </div>
      );
};

export default ChartComponent;