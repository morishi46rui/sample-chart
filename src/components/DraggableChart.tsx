import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const DraggableChart: React.FC = () => {
	const chartRef = useRef<HighchartsReact.RefObject>(null);

	const options: Highcharts.Options = {
		chart: {
			type: "column",
			animation: false,
			height: 600,
		},

		title: {
			text: "Custom draggable bars (without module)",
		},
		xAxis: {
			categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		},
		yAxis: {
			softMin: -200,
			softMax: 400,
			title: { text: "Value" },
		},
		plotOptions: {
			series: {
				animation: false,
			},
		},
		series: [
			{
				type: "column",
				data: [0, 71.5, -106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, -95.6, 54.4],
			},
		],
	};

	useEffect(() => {
		const chart = chartRef.current?.chart;
		if (!chart) return;

		let isDragging = false;
		let draggingPoint: Highcharts.Point | null = null;

		const onMouseDown = (e: MouseEvent, point: Highcharts.Point) => {
			isDragging = true;
			draggingPoint = point;
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!isDragging || !draggingPoint) return;

			const chart = chartRef.current?.chart;
			if (!chart) return;

			const chartPosition = chart.pointer.normalize(e);
			const newValue = chart.yAxis[0].toValue(chartPosition.chartY);

			draggingPoint.update(newValue, true, false);
		};

		const onMouseUp = () => {
			isDragging = false;
			draggingPoint = null;
		};

		// 全ポイントにイベント追加
		for (const point of chart.series[0].points) {
			const el = point.graphic?.element;
			if (!el) continue;

			el.style.cursor = "grab";

			el.addEventListener("mousedown", (e) => onMouseDown(e as MouseEvent, point));
		}

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, []);

	return (
		<div>
			<HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
		</div>
	);
};
