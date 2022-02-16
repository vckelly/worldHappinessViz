export const tooltipSizing = (tooltip, event, curTextLen, height, width, browser) => {
  if (browser === "Chrome") {
    if (curTextLen < 40) {
      tooltip.style("height", "20px");

      if (window.screen.width < 450) {
        tooltip
          .style("top", parseInt(event.offsetY - height * 1.6) + "px")
          .style("left", parseInt(event.offsetX - width * 0.13) + "px");
      } else if (window.screen.width < 768) {
        tooltip
          .style("top", parseInt(event.offsetY - height * 1.45) + "px")
          .style("left", parseInt(event.offsetX - width * 0.15) + "px");
      } else if (window.screen.width < 1024) {
        tooltip
          .style("top", parseInt(event.offsetY - height * 1.4) + "px")
          .style("left", parseInt(event.offsetX - width * 0.2) + "px");
      } else {
        tooltip
          .style("top", parseInt(event.offsetY - height * 1.45) + "px")
          .style("left", parseInt(event.offsetX - width * 0.19) + "px");
      }
    } else {
      if (window.screen.width < 450) {
        tooltip
          .style("top", parseInt(event.offsetY - height * 1.6) + "px")
          .style("left", parseInt(event.offsetX - width * 0.13) + "px");
      } else if (window.screen.width < 768) {
        tooltip
          .style("top", parseInt(event.offsetY - height * 1.45) + "px")
          .style("left", parseInt(event.offsetX - width * 0.15) + "px");
      } else if (window.screen.width < 1024) {
        tooltip
          .style("top", parseInt(event.offsetY - height * 1.45) + "px")
          .style("left", parseInt(event.offsetX - width * 0.2) + "px");
      } else {
        tooltip
          .style("top", parseInt(event.offsetY - height * 1.45) + "px")
          .style("left", parseInt(event.offsetX - width * 0.19) + "px");
      }
    }
  } else {
    if (curTextLen < 40) {
      tooltip.style("height", "20px");

      if (window.screen.width < 450) {
        tooltip
          .style("top", parseInt(event.clientY - height * 1.3) + "px")
          .style("left", parseInt(event.clientX - width * 0.13) + "px");
      } else if (window.screen.width < 768) {
        tooltip
          .style("top", parseInt(event.clientY - height * 1.3) + "px")
          .style("left", parseInt(event.clientX - width * 0.1) + "px");
      } else if (window.screen.width < 1024) {
        tooltip
          .style("top", parseInt(event.clientY - height * 1.4) + "px")
          .style("left", parseInt(event.clientX - width * 0.2) + "px");
      } else {
        tooltip
          .style("top", parseInt(event.clientY - height * 1.2) + "px")
          .style("left", parseInt(event.clientX - width * 0.19) + "px");
      }
    } else {
      if (window.screen.width < 450) {
        tooltip
          .style("top", parseInt(event.clientY - height * 3) + "px")
          .style("left", parseInt(event.clientX - width * 0.25) + "px");
      } else if (window.screen.width < 768) {
        tooltip
          .style("top", parseInt(event.clientY - height * 1.4) + "px")
          .style("left", parseInt(event.clientX - width * 0.2) + "px");
      } else if (window.screen.width < 1024) {
        tooltip
          .style("top", parseInt(event.clientY - height * 1.7) + "px")
          .style("left", parseInt(event.clientX - width * 0.25) + "px");
      } else {
        tooltip
          .style("top", parseInt(event.clientY - height * 1.25) + "px")
          .style("left", parseInt(event.clientX - width * 0.15) + "px");
      }
    }
  }
}