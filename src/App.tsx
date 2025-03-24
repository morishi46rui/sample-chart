import "./App.css";
import { DataChart } from "./components/DataChart";
import { SampleChart } from "./components/SampleChart";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Sample Chart</h1>
				<SampleChart />
				<h1>データ入力ができるチャート</h1>
				<DataChart />
			</header>
		</div>
	);
}

export default App;
