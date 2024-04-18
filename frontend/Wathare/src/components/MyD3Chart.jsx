import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function MyD3Chart({ data }) {
  const [summary, setSummary] = useState({
    ones: 0,
    zeros: 0,
    maxZeroSequence: 0,
    maxOneSequence: 0,
  });
  const d3Container = useRef(null);

  useEffect(() => {
    function identifyMissingSamples(data) {
      const formattedData = [];
      let prevTimestamp = null;
      let ones = 0;
      let zeros = 0;
      let maxZeroSequence = 0;
      let maxOneSequence = 0;
      let currentZeroSequence = 0;
      let currentOneSequence = 0;

      for (let i = 0; i < data.length; i++) {
        const currentTimestamp = new Date(data[i].ts);
        if (prevTimestamp !== null) {
          const diffInSeconds = Math.floor(
            (currentTimestamp - prevTimestamp) / 1000
          );
          if (diffInSeconds > 1) {
            // If there's a gap between timestamps, insert missing samples
            for (let j = 1; j < diffInSeconds; j++) {
              const missingTimestamp = new Date(
                prevTimestamp.getTime() + j * 1000
              );
              const missingHour = String(
                missingTimestamp.getUTCHours()
              ).padStart(2, "0");
              const missingMinute = String(
                missingTimestamp.getUTCMinutes()
              ).padStart(2, "0");
              const missingSecond = String(
                missingTimestamp.getUTCSeconds()
              ).padStart(2, "0");
              formattedData.push({
                x: `${missingHour}:${missingMinute}:${missingSecond}`,
                constantHeight: 1,
                machine_status: null, // Indicate missing status
                missing: true, // Flag to indicate missing sample
              });
            }
          }
        }

        const currentHour = String(currentTimestamp.getUTCHours()).padStart(
          2,
          "0"
        );
        const currentMinute = String(currentTimestamp.getUTCMinutes()).padStart(
          2,
          "0"
        );
        const currentSecond = String(currentTimestamp.getUTCSeconds()).padStart(
          2,
          "0"
        );
        formattedData.push({
          x: `${currentHour}:${currentMinute}:${currentSecond}`,
          constantHeight: 1,
          machine_status: data[i].machine_status,
        });

        // Update summary metrics
        if (data[i].machine_status === 1) {
          ones++;
          currentOneSequence++;
          currentZeroSequence = 0;
          maxOneSequence = Math.max(maxOneSequence, currentOneSequence);
        } else if (data[i].machine_status === 0) {
          zeros++;
          currentZeroSequence++;
          currentOneSequence = 0;
          maxZeroSequence = Math.max(maxZeroSequence, currentZeroSequence);
        }

        prevTimestamp = currentTimestamp;
      }

      const summary = { ones, zeros, maxZeroSequence, maxOneSequence };

      return { formattedData, summary };
    }

    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);

      // Preprocess data to identify missing samples
      const totalData = identifyMissingSamples(data);

      const preprocessedData = totalData.formattedData;
      setSummary(totalData.summary);
      console.log(summary);

      // Clear SVG to avoid duplicates
      svg.selectAll("*").remove();

      const margin = { top: 20, right: 20, bottom: 30, left: 60 };
      const width = 1000 - margin.left - margin.right;
      const height = 100 - margin.top - margin.bottom; // Adjusted height

      const xScale = d3
        .scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(preprocessedData.map((d) => d.x));

      const yScale = d3.scaleLinear().range([height, 0]).domain([0, 1]);

      const getColor = (status) => {
        if (status === 1) {
          return "#339933";
        } else if (status === 0) {
          return "#FFFF33";
        } else if (status === null) {
          return "#FF0000";
        } else {
          return "#000000";
        }
      };

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .text("Cycle status");

      g.selectAll(".bar")
        .data(preprocessedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(1))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(1))
        .attr("fill", (d) =>
          d.machine_status === null
            ? getColor(null)
            : getColor(d.machine_status)
        );


      const initialValue = preprocessedData[0].x.split(":")[0];
      const finalHour = preprocessedData[preprocessedData.length - 1].x.split(":")[0];
      const finalValue = preprocessedData[preprocessedData.length - 1].x;

      const tickValues = [];
      for (let i = parseInt(initialValue); i <= parseInt(finalHour); i++) {
        tickValues.push(`${String(i).padStart(2, "0")}:00:00`);
      }
      tickValues.push(finalValue);


      g.append("g").attr("transform", `translate(0,${height})`).call(
        d3.axisBottom(xScale).tickValues(tickValues)
      );

      g.append("g").call(d3.axisLeft(yScale).ticks(1));
    }
  }, [data]);

  return (
    <div>
      <div>
        <svg
          className="d3-component"
          width={1000}
          height={100}
          ref={d3Container}
        />
      </div>
      <h2>Summary</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table
          className="table table-bordered table-striped text-center"
          style={{ width: "50%" }}
        >
          <thead>
            <tr>
              <th scope="col">Total Ones</th>
              <th scope="col">Total Zeros</th>
              <th scope="col">Max Zero Sequence</th>
              <th scope="col">Max One Sequence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{summary.ones}</td>
              <td>{summary.zeros}</td>
              <td>{summary.maxZeroSequence}</td>
              <td>{summary.maxOneSequence}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
