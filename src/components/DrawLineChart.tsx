import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const DrawLineChart: React.FC = () => {
	const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

	useEffect(() => {
		let startPoint: { x: number; y: number; value: number } | null = null;
		let endPoint: { x: number; y: number; value: number } | null = null;

		let startCircle: Highcharts.SVGElement | null = null;
		let endCircle: Highcharts.SVGElement | null = null;
		let line: Highcharts.SVGElement | null = null;
		let startLabel: Highcharts.SVGElement | null = null;
		let endLabel: Highcharts.SVGElement | null = null;
		let differenceLabel: Highcharts.SVGElement | null = null;

		const chart = chartComponentRef.current?.chart;

		if (chart) {
			chart.update({
				chart: {
					events: {
						click: function (event: Highcharts.PointerEventObject) {
							const coords = chart.pointer.getCoordinates(event);
							const yAxisVal = coords.yAxis?.[0]?.value;
							const x = event.chartX;
							const y = event.chartY;

							if (yAxisVal === undefined) return;

							// 始点を新たに指定する場合は、すべてリセット
							if (!startPoint) {
								// すべての描画オブジェクトを削除
								for (const el of [startCircle, endCircle, line, startLabel, endLabel, differenceLabel]) {
									if (el) el.destroy();
								}

								startPoint = { x, y, value: yAxisVal };

								startCircle = this.renderer.circle(x, y, 5).attr({ fill: "red" }).add();
								startLabel = this.renderer
									.text(`始点: ${yAxisVal.toFixed(2)}`, x + 10, y - 10)
									.css({ color: "red", fontSize: "12px" })
									.add();
							} else {
								endPoint = { x, y, value: yAxisVal };

								endCircle = this.renderer.circle(x, y, 5).attr({ fill: "blue" }).add();
								endLabel = this.renderer
									.text(`終点: ${yAxisVal.toFixed(2)}`, x + 10, y - 10)
									.css({ color: "blue", fontSize: "12px" })
									.add();

								line = this.renderer
									.path(["M", startPoint.x, startPoint.y, "L", endPoint.x, endPoint.y] as unknown as Highcharts.SVGPathArray)
									.attr({ stroke: "green", "stroke-width": 2 })
									.add();

								const difference = ((endPoint.value - startPoint.value) / startPoint.value) * 100;

								differenceLabel = this.renderer
									.text(`差分: ${difference.toFixed(2)}%`, startPoint.x, startPoint.y - 30)
									.css({ color: "black", fontSize: "14px", backgroundColor: "white" })
									.add();

								// リセット（次のクリックで新しい始点として使えるように）
								startPoint = null;
								endPoint = null;
							}
						},
					},
				},
			});
		}
	}, []);

	const options: Highcharts.Options = {
		chart: {
			type: "line",
		},
		title: {
			text: "クリックで始点と終点を決定",
		},
		xAxis: {
			title: {
				text: "X 軸",
			},
		},
		yAxis: {
			title: {
				text: "Y 軸",
			},
		},
		tooltip: {
			enabled: false,
		},
		series: [
			{
				name: "データ",
				type: "line",
				data: [0, 10, 25, 50, 80, 100],
			},
		],
	};

	return (
		<div>
			<HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
		</div>
	);
};
