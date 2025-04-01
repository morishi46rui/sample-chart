import "./App.css";
import { CombinedChart } from "./components/CombinedChart";
import { CompareMultipleChart } from "./components/CompareMultipleChart";
import { DataChart } from "./components/DataChart";
import { DraggableChart } from "./components/DraggableChart";
import DraggableStockChart from "./components/DraggableStockChart";
import { DrawLineChart } from "./components/DrawLineChart";
import { SampleChart } from "./components/SampleChart";
import { ScatterPlotChart } from "./components/ScatterPlotChart";
import { StockChart } from "./components/StockChart";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<div>
					<div style={{ margin: "2rem" }}>
						<h1>Sample Chart</h1>
						<SampleChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>データ入力ができるチャート</h1>
						<DataChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>線を描画できるチャート</h1>
						<DrawLineChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>折れ線チャートと棒チャートの複合表示</h1>
						<CombinedChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>データポイントをドラッグできるチャート（仮）</h1>
						<DraggableChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>株価チャート</h1>
						<StockChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>inputとgraphの同期</h1>
						<DraggableStockChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>複数の折れ線チャート</h1>
						<CompareMultipleChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>散布図</h1>
						<ScatterPlotChart />
					</div>
					<div style={{ margin: "2rem" }}>
						<h1>予想ランキング</h1>
					</div>
				</div>
			</header>
		</div>
	);
}

export default App;
