import { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const DraggableChart: React.FC = () => {
	const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

	const options: Highcharts.Options = {
		chart: {
			type: "line",
		},
		title: {
			text: "ドラッグドロップで変更できる折れ線チャート",
		},
		xAxis: {
			title: {
				text: "X軸",
			},
		},
		yAxis: {
			title: {
				text: "Y軸",
			},
		},
		series: [
			{
				name: "データセット1",
				type: "line",
				data: [
					[0, 1],
					[1, 3],
					[2, 2],
					[3, 5],
					[4, 4],
				],
				dragDrop: {
					draggableY: true, // Y軸方向のドラッグを有効化
				},
			},
		],
		plotOptions: {
			series: {
				dragDrop: {
					draggableY: true, // Y軸方向のドラッグを有効化
				},
				point: {
					events: {
						// ドラッグ後のイベントを追加（必要に応じて）
						drop: function () {
							console.log("新しい値:", this.y);
						},
					},
				},
			},
		},
	};

	return (
		<div>
			<HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
		</div>
	);
};
