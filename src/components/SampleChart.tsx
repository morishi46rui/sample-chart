import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
	title: {
		text: "サンプル折れ線グラフ",
	},
	xAxis: {
		categories: ["月", "火", "水", "木", "金", "土", "日"],
	},
	yAxis: {
		title: {
			text: "売上（万円）",
		},
	},
	series: [
		{
			name: "店舗A",
			data: [5, 7, 3, 6, 8, 4, 9],
		},
	],
};

export const SampleChart: React.FC = () => {
	return <HighchartsReact highcharts={Highcharts} options={options} />;
};
