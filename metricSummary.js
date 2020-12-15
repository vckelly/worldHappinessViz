export const metricSummary = (selection, props) => {
  const {                      
    backgroundRectWidth,
    backgroundRectHeight,
    text        
  } = props;                   
  
  const backgroundRect = selection.selectAll('rect')
    .data([null]);    
  backgroundRect.enter().append('rect')
    .merge(backgroundRect)         
      .attr('x', 50)   
      .attr('y', 50)  
      .attr('width', backgroundRectWidth)
      .attr('height', backgroundRectHeight) 
      .attr('fill', 'white')
      .attr('opacity', 0.8)
    .append('text')
      .text(text);
  
}