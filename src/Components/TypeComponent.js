import * as React from 'react';
import * as d3 from "d3";
import { DataContext } from "./DataContext";
import { Slider } from '@mui/material';
import { AdditionalMetrics } from './AdditionalMetrics'

const TypeComponent = () => {
    const { csvData } = React.useContext(DataContext);

    const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    
    function filterByMonth(data, targetMonth) {
        return data.filter( d=> {
            const month = d3.timeFormat("%m")(new Date(d['date']));
            return month === targetMonth
        })
    }

    const [selectedMonth, setSelectedMonth] = React.useState(1);
    
        const handleSliderChange = (event, newValue) => {
            setSelectedMonth(newValue)
        };

    React.useEffect(() => {
        const chosenMonth = `${String(selectedMonth).padStart(2,'0')}`
        adjustChart(chosenMonth);
        
    }, [selectedMonth]);

    function adjustChart(value){
        const width = 400, height = 210, margin = {top: 20, bottom: 30, right: 20, left: 40};
        const svg = d3.select('#typeBarChart').select("svg")
        console.log(value)
        const filteredData = filterByMonth(csvData, value);
        const groupedVisitorTypeData = Array.from(d3.rollup(filteredData, v => d3.sum(v, d => d['NoV']), d => d['VisitorType']),([VisitorType,NoV]) => ({VisitorType, NoV}));
        const xAxis = d3.scaleBand().domain(groupedVisitorTypeData.map(d => d.VisitorType)).range([margin.left, width - margin.right]).padding(0.2);

        const yAxis = d3.scaleLinear().domain([0, d3.max(groupedVisitorTypeData, (d) => Math.max(d['NoV']))]).range([height - margin.bottom, margin.top]).nice();
        svg.select(".categories").transition().duration(2000).call(d3.axisBottom(xAxis));
        svg.select(".visPoP").transition().duration(2000).call(d3.axisLeft(yAxis));

        //svg.selectAll("rect").remove();

        const u = svg.selectAll("rect").data(groupedVisitorTypeData)

        u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(2000)
        .attr("x", (d) => xAxis(d['VisitorType']))
            .attr("y", (d) => yAxis(d['NoV']))
            .attr("width", xAxis.bandwidth())
            .attr("height", (d) => height - margin.bottom - yAxis(d['NoV']))
            .attr("fill", "black")
    }

    React.useEffect(() => {

        const width = 400, height = 210, margin = {top: 20, bottom: 30, right: 20, left: 40};
        
        d3.select("#typeBarChart").html("");
    
        const svg = d3.select('#typeBarChart')
        .append("svg")
        .attr("width", width)
        .attr("height", height)

        const filteredData = filterByMonth(csvData, "01");
        console.log(filteredData);
        
        const groupedVisitorTypeData = Array.from(d3.rollup(filteredData, v => d3.sum(v, d => d['NoV']), d => d['VisitorType']),([VisitorType,NoV]) => ({VisitorType, NoV}));
        console.log(groupedVisitorTypeData)


        const xAxis = d3.scaleBand().domain(groupedVisitorTypeData.map(d => d.VisitorType)).range([margin.left, width - margin.right]).padding(0.2);

        const yAxis = d3.scaleLinear().domain([0, d3.max(groupedVisitorTypeData, (d) => Math.max(d['NoV']))]).range([height - margin.bottom, margin.top]).nice();
    
        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xAxis)).attr("class", "categories")
    
        svg.append("g").attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yAxis)).attr("class", "visPoP")

        svg.selectAll("rect")
        .data(groupedVisitorTypeData)
        .enter()
        .append("rect")
            .attr("x", (d) => xAxis(d['VisitorType']))
            .attr("y", (d) => yAxis(d['NoV']))
            .attr("width", xAxis.bandwidth())
            .attr("height", (d) => height - margin.bottom - yAxis(d['NoV']))
            .attr("fill", "black")

      }, [csvData]);
    
      return (
      <div>
        <div style={{ width: 300, margin: "20px auto", textAlign: "center" }}>
            <Slider
            value={selectedMonth}
            min={1}
            max={12}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
            />
        </div>
        <div id='typeBarChart'></div>
        <h2>Month of: {Months[selectedMonth-1]}</h2>
      </div>
      );
};

export default TypeComponent;