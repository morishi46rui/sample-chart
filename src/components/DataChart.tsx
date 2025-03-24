import { type ChangeEvent, useState, type KeyboardEvent } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const DataChart: React.FC = () => {
	const [inputValues, setInputValues] = useState<string[]>(["5", "7", "3", "6", "8", "4", "9"]);
	const [chartData, setChartData] = useState<number[]>(inputValues.map((v) => Number.parseFloat(v)));

	const handleValueChange = (index: number, value: string) => {
		const newValues = [...inputValues];
		newValues[index] = value;
		setInputValues(newValues);
	};

	const applyValue = (index: number) => {
		const newData = [...chartData];
		const parsed = Number.parseFloat(inputValues[index]);
		newData[index] = Number.isNaN(parsed) ? 0 : parsed;
		setChartData(newData);
	};

	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			applyValue(index);
			// フォーカス外して blur も発生させたい場合
			(e.target as HTMLInputElement).blur();
		}
	};

	const options: Highcharts.Options = {
		title: {
			text: "サンプル折れ線グラフ",
		},
		xAxis: {
			categories: Array.from({ length: chartData.length }, (_, i) => `データ${i + 1}`),
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
				data: chartData,
			},
		],
	};

	return (
		<div>
			<div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
				{inputValues.map((value, index) => (
					<input
						key={`input-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
						type="number"
						value={value}
						onChange={(e: ChangeEvent<HTMLInputElement>) => handleValueChange(index, e.target.value)}
						onBlur={() => applyValue(index)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						style={{ width: "80px", padding: "0.5rem" }}
					/>
				))}
			</div>
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	);
};
