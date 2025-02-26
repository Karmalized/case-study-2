import * as React from 'react';
import * as d3 from "d3";
import { DataContext } from "./DataContext";
import { ButtonGroup, Button, avatarClasses } from '@mui/material';


const PredictiveChartComponent = () => {
    const {csvData} = React.useContext(DataContext);

    function filterWeather(weatherCondition){
        return csvData.filter(d => {return weatherCondition === d['Weather']})
    }

    function gainInsights(slope){
        if(slope > 0)
            return "Possible Increase"
        else if(slope == 0){
            return "No Change"
        } else {
            return "Possible Decrease"
        }
    }

    function updateChart(newWeatherCondition){
        const filteredData = filterWeather(newWeatherCondition)

        const groupVisitorWeatherData = Array.from(d3.rollup(filteredData, v => d3.sum(v, d => d['NoV']), d => d['date']),([date,NoV]) => ({date,NoV}))

        console.log(groupVisitorWeatherData)

        const width = 400, height = 210, margin = {top: 20, bottom: 30, right: 20, left: 40};

        const svg = d3.select('#PredictiveChart')

        const xAxis = d3.scaleTime().domain(d3.extent(groupVisitorWeatherData, d => d['date'])).range([margin.left, width - margin.right]);

        svg.select(".dateX").transition().duration(2000)
                .call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%b")))

        const yAxis = d3.scaleLinear().domain([0, d3.max(groupVisitorWeatherData, d => d['NoV'])]).range([height-margin.bottom,margin.top]).nice();

        svg.select(".PopY").transition().duration(2000).call(d3.axisLeft(yAxis));

        svg.selectAll("circle").remove();

        svg.select(".collectedData")
    .selectAll("circle")
    .data(groupVisitorWeatherData)
    .join("circle")
    .attr("cx", d => xAxis(d.date))
    .attr("cy", d => yAxis(0))
    .transition()
    .duration(2000)
    .attr("cx", d => xAxis(d.date))
    .attr("cy", d => yAxis(d.NoV))
      .attr("r", 3)
      .attr("fill", "purple")
      .on("end", () => {
        const popValues = Array.from(d3.map(groupVisitorWeatherData, d => d.NoV))
        const sizeOfItems = popValues.length
        console.log(d3.mean(popValues))

      const dataValues = d3.selectAll("circle").nodes().map(node => {
        return {
            x: Number(d3.select(node).attr('cx')),
            y: Number(d3.select(node).attr('cy')),
            xx: Math.pow(Number(d3.select(node).attr('cx')),2),
            xy: (Number(d3.select(node).attr('cx'))) * (Number(d3.select(node).attr('cy')))
        }
      })

      const slope = (sizeOfItems * d3.sum(dataValues, d => d.xy) - (d3.sum(dataValues, d => d.x) * d3.sum(dataValues, d => d.y)))/(sizeOfItems * d3.sum(dataValues, d => d.xx) - (d3.sum(dataValues, d => d.x) * d3.sum(dataValues, d => d.x)))
      const intercept = (d3.sum(dataValues, d => d.y) - (slope * d3.sum(dataValues, d => d.x)))/sizeOfItems;

      const interpretedSlope = -slope

      const y1 = slope * (d3.min(dataValues, d => d.x)) + intercept
      const y2 = slope * (d3.max(dataValues, d => d.x)) + intercept

      svg.select(".trendline")
      .transition()
      .duration(2000)
      .attr("x1", margin.left)
      .attr("y1", y1)
      .attr("x2", width - margin.right)
      .attr("y2", y2)
      .attr("stroke", "red")
      .attr("stroke-width", 2);

      setTrendInformation(interpretedSlope)
      setValuableInsights(gainInsights(interpretedSlope))
      });

    }

    const [trendInformation, setTrendInformation] = React.useState(0)
    const [valuableInsights, setValuableInsights] = React.useState("No Change")

    React.useEffect(() => {

        const filteredData = filterWeather('Cloudy')
        console.log(filteredData)

        const groupVisitorWeatherData = Array.from(d3.rollup(filteredData, v => d3.sum(v, d => d['NoV']), d => d['date']),([date,NoV]) => ({date,NoV}))
        console.log(groupVisitorWeatherData.length)

        const width = 400, height = 210, margin = {top: 20, bottom: 30, right: 20, left: 40};

        d3.select("#PredictiveChart").html("");

        const svg = d3.select('#PredictiveChart')
                .append("svg")
                .attr("width", width)
                .attr("height", height)

        const xAxis = d3.scaleTime().domain(d3.extent(groupVisitorWeatherData, d => d['date'])).range([margin.left, width - margin.right]);

        svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%b"))).attr("class", "dateX")

        const yAxis = d3.scaleLinear().domain([0, d3.max(groupVisitorWeatherData, d => d['NoV'])]).range([height-margin.bottom,margin.top]).nice();

        svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yAxis)).attr("class", "PopY");

        const circles = svg.append("g")
    .attr("class", "collectedData")
    .selectAll("circle")
    .data(groupVisitorWeatherData)
    .join("circle")
    .attr("cx", d => xAxis(d.date))
    .attr("cy", d => yAxis(d.NoV))
      .attr("r", 3)
      .attr("fill", "purple");

      if(groupVisitorWeatherData.length != 0){
        const popValues = Array.from(d3.map(groupVisitorWeatherData, d => d.NoV))
        const sizeOfItems = popValues.length
        console.log(d3.mean(popValues))

      const dataValues = d3.selectAll("circle").nodes().map(node => {
        return {
            x: Number(d3.select(node).attr('cx')),
            y: Number(d3.select(node).attr('cy')),
            xx: Math.pow(Number(d3.select(node).attr('cx')),2),
            xy: (Number(d3.select(node).attr('cx'))) * (Number(d3.select(node).attr('cy')))
        }
      })

      console.log(dataValues)
      const slope = (sizeOfItems * d3.sum(dataValues, d => d.xy) - (d3.sum(dataValues, d => d.x) * d3.sum(dataValues, d => d.y)))/(sizeOfItems * d3.sum(dataValues, d => d.xx) - (d3.sum(dataValues, d => d.x) * d3.sum(dataValues, d => d.x)))
      const intercept = (d3.sum(dataValues, d => d.y) - (slope * d3.sum(dataValues, d => d.x)))/sizeOfItems;

      const y1 = slope * (d3.min(dataValues, d => d.x)) + intercept
      const y2 = slope * (d3.max(dataValues, d => d.x)) + intercept

      const interpretedSlope = -slope

      setTrendInformation(interpretedSlope)
      setValuableInsights(gainInsights(interpretedSlope))
      console.log(slope)
      console.log(y1)
      console.log(y2)

      svg.append("line")
      .attr("x1", margin.left)
      .attr("y1", y1)
      .attr("x2", width - margin.right)
      .attr("y2", y2)
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("class", "trendline");
      }

    },[csvData])

    return(
        <div>
            <ButtonGroup size='small' variant='contained' aria-label='Basic button group' style={{margin: "10px auto"}}>
                <Button onClick={() => updateChart('Cloudy')}>Cloudy</Button>
                <Button onClick={() => updateChart('Stormy')}>Stormy</Button>
                <Button onClick={() => updateChart('Sunny')}>Sunny</Button>
                <Button onClick={() => updateChart('Snowy')}>Snowy</Button>
                <Button onClick={() => updateChart('Rainy')}>Rainy</Button>
            </ButtonGroup>
            <div id="PredictiveChart"></div>
            <h3>Trend Line: {trendInformation}</h3>
            <h3>{valuableInsights} in Visitor Traffic</h3>
        </div>
    )
}

export default PredictiveChartComponent;