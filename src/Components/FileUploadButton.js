import * as React from 'react';
import * as d3 from 'd3';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudIcon from '@mui/icons-material/CloudUpload'
import { DataContext } from "./DataContext"
  
    const FileUploadButton = () => {

      const HiddenInput = styled('input')({
        clip: 'rect(0,0,0,0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

      const { setCsvData } = React.useContext(DataContext);

      const HandleUpload = (event) => {
        const dataFile = event.target.files[0];
          console.log(dataFile);
          if(!dataFile) return;
  
          const readCSV = new FileReader();
          readCSV.onload = function(e) {
            const csvFile = e.target.result;
            console.log(csvFile)
  
            const data = d3.csvParse(csvFile, function(d) {
              return {
                date: d3.timeParse("%Y-%m-%d")(d['Date']),
                DoW: d['Day of Week'],
                VisitorType: d['Visitor Type'],
                NoV: Number(d['Number of Visitors']),
                AsD: Number(d['Avg Stay Duration (hrs)']),
                Revenue: Number(d['Revenue Generated ($)']),
                Weather: d['Weather Condition']
              }
            })
  
            console.log(data)

            setCsvData(data)
  
          }
          readCSV.readAsText(dataFile);
      };

    return (
        <Button
        component='label'
        role={undefined}
        variant='contained'
        tabIndex={-1}
        startIcon={<CloudIcon/>}>
        Upload File
        <HiddenInput
        type='file'
        onChange={HandleUpload}
        />    
        </Button>
    )
  }

  export default FileUploadButton;
  