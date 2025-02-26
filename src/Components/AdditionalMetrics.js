import * as React from 'react';
import * as d3 from "d3";
import { DataContext } from "./DataContext";

const AdditionalMetrics = () => {
    const { csvData } = React.useContext(DataContext);
    const [revenueGenerated, setRevenueGenerated] = React.useState(0);
    const [generalAverageStay, setAverageStay] = React.useState(0);

    React.useEffect(() => {
        const totalRevenueGenerated = d3.sum(csvData, d => d['Revenue'])
        setRevenueGenerated(totalRevenueGenerated)
        const generalAverageStay = d3.mean(csvData, d => d['AsD'])
        setAverageStay(generalAverageStay)
    },[csvData]);

    return (
        <div>
            <h4>Total Revenue Generated: ${revenueGenerated}</h4>
            <h4>General Average Stay: {generalAverageStay} hrs</h4>
        </div>
    );
};

export default AdditionalMetrics
