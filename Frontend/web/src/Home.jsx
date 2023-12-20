import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/read-task/');
        setTasks(response.data.tasks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (taskId) => {
    // Implemente a lógica para edição com base no taskId
    console.log(`Editar a tarefa com ID ${taskId}`);
  };

  const handleUpdate = (taskId, newStatus) => {
    // Implemente a lógica para atualização com base no taskId e newStatus
    console.log(`Atualizar a tarefa com ID ${taskId} para o status ${newStatus}`);
  };

  const handleCreate = (taskId, newStatus) => {
    // Implemente a lógica para atualização com base no taskId e newStatus
    console.log(`Atualizar a tarefa com ID ${taskId} para o status ${newStatus}`);
  };

  return (
    <div>
      <h1>Task List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
          <button onClick={() => handleCreate()}>Nova</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tarefa</th>
                <th>Status</th>
                <th>Editar</th>
                <th>Atualizar</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.task}</td>
                  <td>{task.status}</td>
                  <td>
                    <button onClick={() => handleEdit(task.id)}>Editar</button>
                  </td>
                  <td>
                    <select onChange={(e) => handleUpdate(task.id, e.target.value)}>
                      <option value="pendente">Pendente</option>
                      <option value="concluir">Concluir</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;