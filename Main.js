import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data => {
    let stackedAreaChart = StackedAreaChart(".stacked-area-chart");
    stackedAreaChart.update(data);

    let areaChart = AreaChart(".area-chart");
    areaChart.update(data);
    
    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range);
    })

});