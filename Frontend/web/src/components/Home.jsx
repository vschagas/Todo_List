import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ModalCreate } from './ModalCreate';


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleEdit = (taskId) => {
    console.log(`Editar a tarefa com ID ${taskId}`);
  };

  const handleUpdate = (taskId, newStatus) => {
    console.log(`Atualizar a tarefa com ID ${taskId} para o status ${newStatus}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTask = () => {
    handleCloseModal();
    fetchData();
  };


  return (
    <div>
      <h1>Task List</h1>
      <ModalCreate isOpen={isModalOpen} onClose={handleCloseModal} onCreateTask={handleCreateTask} />
      {loading ? (
        <p>Loading...</p>
      ) : (
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
      )}
    </div>
  );
};

export default TaskList;