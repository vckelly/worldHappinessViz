export const colorLegend = (selection, props) => {
  const {                      
    colorLegendScale,                
    circleRadius,
    spacing,                   
    textOffset,
    backgroundRectWidth        
  } = props;                   
  
  const backgroundRect = selection.selectAll('rect')
    .data([null]);             
  const n = colorLegendScale.domain().length; 
  backgroundRect.enter().append('rect')
    .merge(backgroundRect)
      .attr('x', -circleRadius * 2)   
      .attr('y', -circleRadius * 2)   
      .attr('rx', circleRadius * 2)   
      .attr('width', backgroundRectWidth)
      .attr('height', spacing * n + circleRadius * 2) 
      .attr('fill', 'white')
      .attr('opacity', 0.8);
  

  const groups = selection.selectAll('.tick')
    .data(colorLegendScale.domain());
  const groupsEnter = groups
    .enter().append('g')
      .attr('class', 'tick');
  groupsEnter
    .merge(groups)
      .attr('transform', (d, i) =>    
        `translate(0, ${i * spacing})`  
      );
  groups.exit().remove();
  
  groupsEnter.append('circle')
    .merge(groups.select('circle')) 
      .attr('r', circleRadius)
      .attr('fill', colorLegendScale);      
  
  groupsEnter.append('text')
    .merge(groups.select('text'))   
      .text(d => d)
      .attr('dy', '0.32em')
      .attr('x', textOffset);
}