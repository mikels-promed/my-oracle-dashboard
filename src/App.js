import './App.css';
import React, {useState, useEffect} from 'react';

function App() {

  const [data, setData] = useState([]);
  const[selectedServer, setSelectedServer] = useState("server2");

  const servers = {
    server1: { label: "server 1"},
    server2: { label: "server 2"},
  };


  useEffect(() => {
    console.log("Fetching data for server: ", selectedServer)
    fetch(`/get_tablespace_storage?server=${selectedServer}`)
      .then((response) => response.json())
      .then((data) => setData(data));
      console.log("Data of ", selectedServer, "has been set")
  }, [selectedServer]);

  const handleAddStorage = async (tablespaceName) => {
    try {
      const response = await fetch(`/add_storage/${tablespaceName}?server=${selectedServer}`, {
        method: 'POST'
      });
      const result = await response.json();

      if(result.success) {

        fetch(`/get_tablespace_storage?server=${selectedServer}`)
          .then((response) =>response.json())
          .then((data) => setData(data));
      }else {
        console.error("Failed to add storage", result.message);
      }
    } catch (error) {
      console.error("Error", error)
    }
  }



  const [serverStatus, setServerStatus] = useState([]);

  useEffect(() => {
    fetch(`/get_server_status?server=${selectedServer}`)
    .then((response) => response.json())
    .then((data) => setServerStatus(data));
  }, [selectedServer]);

  return (
    <div className="App">
      <h1>Capacidad de Base de Datos</h1>
      <select
        value={selectedServer}
        onChange={(e) => setSelectedServer(e.target.value)}
        style={{width: '200px', height: '30px', color: 'black', backgroundColor: 'white'}}
        >
          <option value="server1">Server 1</option>
          <option value="server2">Server 2</option>
        </select>
      <table>
        <thead>
          <tr>
            <th>Tablespace</th>
            <th>Tamaño (MB)</th>
            <th>MBs Utilizados</th>
            <th>MBs Libres</th>
            <th>Pct. Utilizado</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.TablespaceName}</td>
              <td>{row.SizeMB}</td>
              <td>{row.UsedMB}</td>
              <td>{row.FreeMB}</td>
              <td>{row.PctUsed}%
              <div className={`bar ${row.PctUsed < 60 ? "bar-green" : row.PctUsed < 90 ? "bar-yellow" : "bar-red"}`} 
              style={{width: `${row.PctUsed}%`}}></div>
              </td>
              <td>{row.Status}</td>
              <td><button onClick={() => handleAddStorage(row.TablespaceName)}>Agregar espacio</button></td>
              
              
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Server Status</h2>
            <table>
                <thead>
                    <tr>
                        <th>Instancia</th>
                        <th>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    {serverStatus.map((row, index) => (
                        <tr key={index}>
                            <td>{row.instance_name}</td>
                            <td>{row.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

    </div>
  );
}

export default App;
