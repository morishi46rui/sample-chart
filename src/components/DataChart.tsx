import { type ChangeEvent, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const DataChart: React.FC = () => {
	const [data, setData] = useState<number[]>([5, 7, 3, 6, 8, 4, 9]);

	const handleValueChange = (index: number, value: string) => {
		const newData = [...data];
		const parsedValue = Number.parseFloat(value);
		newData[index] = Number.isNaN(parsedValue) ? 0 : parsedValue;
		setData(newData);
	};

	const options: Highcharts.Options = {
		title: {
			text: "サンプル折れ線グラフ",
		},
		xAxis: {
			categories: Array.from({ length: data.length }, (_, i) => `データ${i + 1}`),
		},
		yAxis: {
			title: {
				text: "値",
			},
		},
		series: [
			{
				name: "入力データ",
				type: "line",
				data: data,
			},
		],
	};

	return (
		<div>
			<div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
				{data.map((value, index) => {
					const uniqueKey = `data-input-${index}-${value}`;
					return (
						<input
							key={uniqueKey}
							type="number"
							value={value}
							onChange={(e: ChangeEvent<HTMLInputElement>) => handleValueChange(index, e.target.value)}
							style={{ width: "80px", padding: "0.5rem" }}
						/>
					);
				})}
			</div>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	);
};
