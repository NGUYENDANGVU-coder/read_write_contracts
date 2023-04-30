import ReadContracts from "./components/ReadContracts";
import WriteContracts from "./components/WriteContracts";
function App() {
  
  return (
    <div className="flex items-center justify-around w-full h-screen App">
      <ReadContracts/>
      <WriteContracts/>
    </div>
  );
}

export default App;
