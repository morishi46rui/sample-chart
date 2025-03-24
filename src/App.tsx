import "./App.css";
import { DataChart } from "./components/DataChart";
import { DrawLineChart } from "./components/DrawLineChart";
import { SampleChart } from "./components/SampleChart";

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
				</div>
			</header>
		</div>
	);
}

export default App;
